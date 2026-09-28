var SMS_NUMBER = "9771";
var MIN_YEAR = 2006;

var vehicleType  = document.querySelector("#vehicle-type");
var vehicleInfo  = document.querySelector("#vehicle-info");
var cnicInput    = document.querySelector("#cnic");
var plateInput   = document.querySelector("#plate");
var provinceSel  = document.querySelector("#province");
var dateInput    = document.querySelector("#reg-date");
var prepareBtn   = document.querySelector("#prepare-btn");
var messageBox   = document.querySelector("#message-box");
var resultBox    = document.querySelector("#result");
var regMessage   = document.querySelector("#reg-message");
var tokMessage   = document.querySelector("#tok-message");
var copyRegBtn   = document.querySelector("#copy-reg-btn");
var sendRegBtn   = document.querySelector("#send-reg-btn");
var copyTokBtn   = document.querySelector("#copy-tok-btn");
var sendTokBtn   = document.querySelector("#send-tok-btn");

var vehicleRules = {
  bike: "Motorcycle, chingchi or rickshaw: the vehicle does not need to be in your name. Benefit is a flat Rs. 500 weekly token (one every 7 days), and the vehicle must be registered on or after 1 Jan 2006.",
  car: "Car up to 800cc: the vehicle must be in your own name and you must be present at the pump. Benefit is Rs. 100 per litre on 10 litres per token (one every 10 days), and the car must be registered on or after 1 Jan 2006."
};

var today = new Date().toISOString().split("T")[0];
dateInput.max = today;

function showVehicleInfo() {
  vehicleInfo.textContent = vehicleRules[vehicleType.value];
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "status " + type;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "status";
}

function formatDate(isoDate) {
  var parts = isoDate.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function prepareMessage() {
  var cnic = cnicInput.value.replace(/[^0-9]/g, "");
  var plate = plateInput.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  var province = provinceSel.value;
  var date = dateInput.value;

  resultBox.classList.add("hidden");

  if (cnic.length !== 13) {
    showMessage("Your CNIC needs exactly 13 digits.", "error");
    return;
  }

  if (plate === "") {
    showMessage("Please enter your vehicle number plate.", "error");
    return;
  }

  if (date === "") {
    showMessage("Please choose the vehicle registration date.", "error");
    return;
  }

  var year = Number(date.split("-")[0]);
  if (year < MIN_YEAR) {
    showMessage("Vehicles registered before 1 January 2006 are not eligible.", "error");
    return;
  }

  var message = "REG " + cnic + " " + plate + " " + province + " " + formatDate(date);

  regMessage.textContent = message;
  resultBox.classList.remove("hidden");
  showMessage("Message ready. Check it carefully, then send it to " + SMS_NUMBER + ".", "ok");
}

function copyText(text, button) {
  var original = button.textContent;

  navigator.clipboard.writeText(text).then(function () {
    button.textContent = "Copied";
    setTimeout(function () {
      button.textContent = original;
    }, 1500);
  });
}

function openSmsApp(text) {
  window.location.href = "sms:" + SMS_NUMBER + "?body=" + encodeURIComponent(text);
}

vehicleType.addEventListener("change", showVehicleInfo);
prepareBtn.addEventListener("click", prepareMessage);

cnicInput.addEventListener("input", clearMessage);
plateInput.addEventListener("input", clearMessage);

copyRegBtn.addEventListener("click", function () {
  copyText(regMessage.textContent, copyRegBtn);
});

sendRegBtn.addEventListener("click", function () {
  openSmsApp(regMessage.textContent);
});

copyTokBtn.addEventListener("click", function () {
  copyText(tokMessage.textContent, copyTokBtn);
});

sendTokBtn.addEventListener("click", function () {
  openSmsApp(tokMessage.textContent);
});

showVehicleInfo();