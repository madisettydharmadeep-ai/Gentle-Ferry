import dbConnect from '../../../utils/mongodb';
import DailyTasks from '../../../utils/models/DailyTasks';
import User from '../../../utils/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId || !date) {
      return NextResponse.json({ success: false, error: 'User ID and Date required' }, { status: 400 });
    }

    const dailyTasks = await DailyTasks.findOne({ userId, date });
    const user = await User.findById(userId);
    const ignored = user?.ignoredHabits || [];

    let tasks = dailyTasks ? dailyTasks.tasks : [];
    // Filter out ignored habits
    const filteredTasks = tasks.filter(t => !t.isHabit || !ignored.includes(t.text));

    return NextResponse.json({ success: true, data: filteredTasks });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, date, tasks, lastSync = 0 } = await request.json();

    if (!userId || !date || !Array.isArray(tasks)) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 1. Get existing record and User (for ignoredHabits)
    let dailyRecord = await DailyTasks.findOne({ userId, date });
    const user = await User.findById(userId);
    const ignored = user?.ignoredHabits || [];

    if (!dailyRecord) {
      // 1a. Simply filter and create
      dailyRecord = await DailyTasks.create({ 
        userId, 
        date, 
        tasks: tasks.filter(t => !t.isHabit || !ignored.includes(t.text))
      });
    } else {
      // 2. Perform a Smart Merge with Deletion Support
      const incomingTasks = tasks;
      const dbTasks = dailyRecord.tasks;

      const taskMap = new Map();
      // Start with client's incoming tasks
      incomingTasks.forEach(t => taskMap.set(t.id, t));

      // Reconcile with DB
      dbTasks.forEach(dbTask => {
        if (!taskMap.has(dbTask.id)) {
          // Task in DB but not in client payload
          const dbTime = new Date(dbTask.updatedAt || 0).getTime();
          // Keep it ONLY if it was updated AFTER the client's last sync (multi-device add)
          if (dbTime > lastSync) {
            taskMap.set(dbTask.id, dbTask);
          }
        } else {
          // Both have it, keep newer item
          const incoming = taskMap.get(dbTask.id);
          const incomingTime = new Date(incoming.updatedAt || 0).getTime();
          const dbTime = new Date(dbTask.updatedAt || 0).getTime();
          if (dbTime > incomingTime) {
            taskMap.set(dbTask.id, dbTask);
          }
        }
      });

      // 3. Final sanitization (Remove Ignored Habits)
      dailyRecord.tasks = Array.from(taskMap.values()).filter(t => !t.isHabit || !ignored.includes(t.text));
      await dailyRecord.save();
    }

    return NextResponse.json({ success: true, data: dailyRecord.tasks });

  } catch (error) {
    console.error('Task Merge Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
