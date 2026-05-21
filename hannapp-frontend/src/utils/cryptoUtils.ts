// Function to generate a cryptographic key
export async function generateKey(secretKey: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey); // Encode the passphrase

    // Hash the passphrase to ensure it is exactly 256 bits
    const hashedKey = await crypto.subtle.digest("SHA-256", keyData);

    // Import the hashed key for AES-GCM encryption
    return await crypto.subtle.importKey(
        "raw",
        hashedKey, // Use the hashed key
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

// Function to encrypt data
export async function encryptData(key: CryptoKey, data: any): Promise<{ u: string; iv: number[] }> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
    const encodedData = encoder.encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedData
    );

    return {
        u: btoa(String.fromCharCode(...new Uint8Array(encrypted))), // Base64 encode
        iv: Array.from(iv) // Convert IV to an array for storage
    };
}

// Function to decrypt data
export async function decryptData(key: CryptoKey, u: string, iv: number[]): Promise<any> {
    const decoder = new TextDecoder();
    const encryptedBuffer = Uint8Array.from(atob(u), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        key,
        encryptedBuffer
    );

    return JSON.parse(decoder.decode(decrypted));
}

// Function to securely save data to localStorage
export async function saveToLocalStorage(secretKey: string, localStorageKey: string, data: any): Promise<void> {
    const key = await generateKey(secretKey);
    const encrypted = await encryptData(key, data);
    const payload = {
        u: encrypted.u,
        iv: encrypted.iv
    };
    localStorage.setItem(localStorageKey, JSON.stringify(payload));
}

// Function to securely load data from localStorage
export async function loadFromLocalStorage(secretKey: string, localStorageKey: string): Promise<any | undefined> {
    const key = await generateKey(secretKey);
    const storedStr = localStorage.getItem(localStorageKey);
    if (!storedStr) return undefined;
    
    const stored = JSON.parse(storedStr);

    if (stored && stored.u && stored.iv) {
        return await decryptData(key, stored.u, stored.iv);
    }
}
