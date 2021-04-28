// Register Service Worker
const registerServiceWorker = async() => {
  try {
    console.log("Registering service worker...");
    const registeration = await navigator.serviceWorker.register("./worker.js", {
      scope: "/"
    });
    console.log('Service worker successfully registered.');
    return registeration
  } catch (e) {
    console.error(e);
  }
}

const askPermission = function () {
  console.log("asking...")
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
      console.log(result)
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
    .then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    });
}

const urlBase64ToUint8Array = function (base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const subscribeUserToPush = async (registration) => {
  try {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    };
    const subscription = await registration.pushManager.subscribe(subscribeOptions);
    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json"
      }
    });
  } catch (e) {
    console.error(e)
  }

}

const publicVapidKey = 'BK2ETbxj0BqaJFzz2PhC-Kx_2DZXZ_s5V9RmukmqFW0U2Eq2kublMGW8N_b_rtCtVehqLjfuKrJlcOybtkOy9yQ';

if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}
else {
  console.log("Service Worker isn't supported on this browser, disable or hide UI.");
}

if (!('PushManager' in window)) {
  console.log("Push isn't supported on this browser, disable or hide UI. ");
}

// Register SW, Register Push, Send Push
async function send() {
  const registration = await registerServiceWorker();
  askPermission();
 await subscribeUserToPush(registration);
}


