
let video = document.getElementById("camera");
let result = document.getElementById("result");
let model;
let uploadedImage = null;

const translations = {
  "mosque": "مسجد",
  "prayer rug": "سجادة صلاة",
  "dome": "قبة",
  "spotlight": "إضاءة موضعية",
  "washbasin": "مغسلة",
  "restaurant": "مطعم",
  "street": "شارع",
  "building": "مبنى",
  "desk": "مكتب",
  "bookstore": "مكتبة",
  "cell phone": "جوال",
  "mobile phone": "جوال",
  "television": "تلفزيون",
  "monitor": "شاشة",
  "ipad": "آيباد",
  "laptop": "لابتوب",
  "computer keyboard": "لوحة مفاتيح",
  "car": "سيارة",
  "bus": "باص",
  "truck": "شاحنة",
  "highway": "طريق سريع",
  "road": "طريق",
  "sofa": "كنبة",
  "chair": "كرسي",
  "table": "طاولة",
  "refrigerator": "ثلاجة",
  "microwave": "ميكروويف",
  "oven": "فرن",
  "bed": "سرير",
  "sink": "حوض",
  "toilet": "دورة مياه",
  "fan": "مروحة",
  "lamp": "مصباح",
  "bag": "شنطة",
  "book": "كتاب",
  "notebook": "دفتر",
  "bottle": "قارورة",
  "remote control": "ريموت"
};

function translateLabel(label) {
  let key = label.toLowerCase().trim();
  for (let k in translations) {
    if (key.includes(k)) {
      return translations[k];
    }
  }
  return "غير معروف";
}

async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
  } catch (error) {
    result.textContent = "❌ لم يتم تشغيل الكاميرا. تأكد من الإذن.";
  }
}

async function loadModel() {
  model = await mobilenet.load();
  result.textContent = "✅ جاهز للتحليل";
}

async function analyze(sourceElement) {
  if (!model) {
    result.textContent = "📦 جاري تحميل النموذج...";
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = sourceElement.videoWidth || sourceElement.width;
  canvas.height = sourceElement.videoHeight || sourceElement.height;
  canvas.getContext("2d").drawImage(sourceElement, 0, 0);
  const predictions = await model.classify(canvas);

  if (predictions.length > 0) {
    const label = predictions[0].className.split(',')[0];
    const translated = translateLabel(label);
    result.textContent = `📍 الوصف: ${translated}`;
  } else {
    result.textContent = "😔 لم أتمكن من التعرف على المكان";
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const img = new Image();
  const reader = new FileReader();

  reader.onload = function(e) {
    img.onload = function() {
      analyze(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

setupCamera();
loadModel();
