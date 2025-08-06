import admin from 'firebase-admin';

let firebaseApp = null;

export const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      const serviceAccount = {
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
      });

      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // Don't throw error to prevent app from crashing if Firebase is not configured
  }
};

export const getFirebaseApp = () => {
  if (!firebaseApp) {
    console.warn('⚠️ Firebase not initialized');
    return null;
  }
  return firebaseApp;
};

// Send push notification
export const sendNotification = async (tokens, payload) => {
  try {
    if (!firebaseApp) {
      console.warn('⚠️ Firebase not initialized, skipping notification');
      return null;
    }

    const message = {
      data: payload.data || {},
      notification: {
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png'
      },
      tokens: Array.isArray(tokens) ? tokens : [tokens]
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('📱 Notification sent successfully:', response.successCount, 'messages sent');
    
    return response;
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    throw error;
  }
};

// Update real-time data
export const updateRealtimeData = async (path, data) => {
  try {
    if (!firebaseApp) {
      console.warn('⚠️ Firebase not initialized, skipping real-time update');
      return null;
    }

    const db = admin.database();
    await db.ref(path).set({
      ...data,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    console.log(`📡 Real-time data updated at path: ${path}`);
  } catch (error) {
    console.error('❌ Failed to update real-time data:', error);
    throw error;
  }
};

// Listen to real-time data changes
export const listenToRealtimeData = (path, callback) => {
  try {
    if (!firebaseApp) {
      console.warn('⚠️ Firebase not initialized, cannot listen to real-time data');
      return null;
    }

    const db = admin.database();
    const ref = db.ref(path);
    
    ref.on('value', callback);
    
    return ref;
  } catch (error) {
    console.error('❌ Failed to listen to real-time data:', error);
    throw error;
  }
};