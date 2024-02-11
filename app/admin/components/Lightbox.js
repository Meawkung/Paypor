import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Lightbox = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" id="lightbox-overlay" onClick={onClose}>
            <div className="relative max-w-screen-md max-h-screen-md" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Enlarged" className="max-h-full max-w-full mx-auto" />
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>,
        document.getElementById('lightbox-root')
    );
};

export default Lightbox;
