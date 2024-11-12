export const decodeJWT = (token) => {
    if (!token) {
        return null; 
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null; 
    }
    try {
        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        console.log("Error decoding token:", error);
        return null; 
    }
};

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
