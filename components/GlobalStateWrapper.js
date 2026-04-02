'use client';
import { AppProvider, useAppContext } from '../app/context/AppContext';
import LoginModal from './LoginModal';
import RequestDriveModal from './RequestDriveModal';
import DevBar from './DevBar';
import FutureLetterPopup from './FutureLetterPopup';

import { GoogleOAuthProvider } from '@react-oauth/google';

import ProModal from './ProModal';

function GlobalModals() {
  const { showLoginModal, setShowLoginModal, login, showDriveModal, setShowDriveModal, requestDrivePermission } = useAppContext();
  return (
    <>
      <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={login}
      />
      <RequestDriveModal 
          isOpen={showDriveModal}
          onClose={() => setShowDriveModal(false)}
          onPermissionGranted={requestDrivePermission}
      />
      <ProModal />
      <FutureLetterPopup />
      <DevBar />
    </>
  );
}

export default function GlobalStateWrapper({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AppProvider>
        {children}
        <GlobalModals />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
