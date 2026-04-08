
const firebaseConfig = {
  apiKey: "AIzaSyDSJ3JTk3rtVGadyOLdy1tYRVTU9MXAP-8",
  authDomain: "dagkamen-6adf3.firebaseapp.com",
  projectId: "dagkamen-6adf3",
  storageBucket: "dagkamen-6adf3.firebasestorage.app",
  messagingSenderId: "484916321091",
  appId: "1:484916321091:web:2110e250dd501503e82df6"
};

// Initialize Firebase (Using CDN version 8 compatibility for easier setup)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
window.db = firebase.firestore();
window.storage = firebase.storage();
const db = window.db; // Для локального использования внутри этого файла

window.uploadFile = async function(file) {
    return new Promise(async (resolve, reject) => {
        try {
            const apiKey = "0dae34fbe5c6ef12927204ed7ac02d09";
            const formData = new FormData();
            formData.append("image", file);
            
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                console.log("Uploaded successfully to ImgBB:", data.data.url);
                resolve(data.data.url);
            } else {
                console.error("ImgBB upload error:", data);
                reject(new Error(data.error?.message || "Неизвестная ошибка ImgBB"));
            }
        } catch (error) {
            console.error("Upload process error:", error);
            reject(error);
        }
    });
};

// --- Глобальные функции для работы с данными ---

window.fetchProducts = async function() {
    try {
        const querySnapshot = await db.collection("products").get();
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("Синхронизация с Firebase (Продукты): Ожидание настройки таблиц...");
        return [];
    }
}

window.fetchProjects = async function() {
    try {
        const querySnapshot = await db.collection("projects").get();
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("Синхронизация с Firebase (Проекты): Ожидание настройки таблиц...");
        return [];
    }
}

window.fetchSettings = async function() {
    try {
        const docRef = db.collection("system").doc("settings");
        const docSnap = await docRef.get();
        return docSnap.exists ? docSnap.data() : null;
    } catch (e) {
        console.warn("Синхронизация с Firebase (Настройки): Ожидание настройки таблиц...");
        return null;
    }
}

window.imageToBase64 = function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
