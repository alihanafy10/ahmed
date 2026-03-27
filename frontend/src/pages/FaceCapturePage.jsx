import { useNavigate } from 'react-router-dom';
import FaceCapture from '../components/FaceCapture';

const FaceCapturePage = ({ setCapturedFace }) => {
    const navigate = useNavigate();

    const handleCapture = (image) => {
        setCapturedFace(image);
        // Mark session as verified
        sessionStorage.setItem('faceVerified', 'true');
        // Navigate to Home or centralized report page after capture
        navigate('/home'); 
    };

    return (
        <FaceCapture onCapture={handleCapture} />
    );
};

export default FaceCapturePage;
