import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVerification } from '../context/VerificationContext';

export const useBookSession = () => {
  const { user, isAuthenticated } = useAuth();
  const { promptVerification } = useVerification();
  const navigate = useNavigate();

  const handleBookSession = (e?: React.MouseEvent | Event, message?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Default message fallback (though we should always pass the exact original message)
    const finalMessage = message || "Hi AVIOX! I would like to book a session.";
    
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingBookingMsg', finalMessage);
      navigate('/login');
      return;
    }
    
    if (!user?.isMobileVerified) {
      promptVerification(finalMessage);
      return;
    }
    
    window.open(`https://wa.me/918921757960?text=${encodeURIComponent(finalMessage)}`, "_blank");
  };

  return handleBookSession;
};
