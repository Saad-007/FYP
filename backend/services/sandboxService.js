// backend/services/sandboxService.js
export const executeStudentCode = async (code) => {
    try {
        const response = await fetch('http://python_sandbox:8000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Sandbox Connection Failed:", error);
        return { success: false, error: "Sandbox is currently unreachable." };
    }
};