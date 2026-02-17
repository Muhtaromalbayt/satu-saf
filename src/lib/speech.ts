export const isSpeechRecognitionSupported = () => {
    if (typeof window !== 'undefined') {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
    return false;
};
