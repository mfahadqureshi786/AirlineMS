var source="assets/plane-";
var slideNo=1;
function slides(){
	document.querySelector("#planeSlide").src=source+slideNo+".jpg";
	if (slideNo<3)
		slideNo++;
	else slideNo=1;
}
setInterval(slides, 2500);
function displayOneWay(){
	if(document.querySelector("#oneWay").checked)
	{
    document.querySelector(".fromTo").classList.remove("fromTo-toggleOff");
    document.querySelector(".fromTo").classList.add("fromTo-toggleOn");
    document.querySelector(".depart").classList.remove("toggleDepartOff");
	document.querySelector(".depart").classList.add("toggleDepartOn");
	//hide others
	document.querySelector(".return").classList.add("toggleReturnOff");
	document.querySelector(".return").classList.remove("toggleReturnOn");
	for (var i = 1; i < document.querySelectorAll(".fromTo").length; i++) {
	document.querySelectorAll(".fromTo")[i].classList.add("fromTo-toggleOff");
    document.querySelectorAll(".fromTo")[i].classList.remove("fromTo-toggleOn");
    document.querySelectorAll(".depart")[i].classList.add("toggleDepartOff");
	document.querySelectorAll(".depart")[i].classList.remove("toggleDepartOn");

	}

	}
}
function displayRoundTrip()
{if(document.querySelector("#roundTrip").checked)
	{   
	document.querySelector(".fromTo").classList.remove("fromTo-toggleOff");
    document.querySelector(".fromTo").classList.add("fromTo-toggleOn");
    document.querySelector(".depart").classList.remove("toggleDepartOff");
	document.querySelector(".depart").classList.add("toggleDepartOn");
	document.querySelector(".return").classList.remove("toggleReturnOff");
	document.querySelector(".return").classList.add("toggleReturnOn");
for (var i = 1; i < document.querySelectorAll(".fromTo").length; i++) {
document.querySelectorAll(".fromTo")[i].classList.add("fromTo-toggleOff");
document.querySelectorAll(".fromTo")[i].classList.remove("fromTo-toggleOn");
document.querySelectorAll(".depart")[i].classList.remove("toggleDepartOn");
document.querySelectorAll(".depart")[i].classList.add("toggleDepartOff");
}

}
// 	else
// 		{   
//             document.querySelectorAll(".return")[0].classList.remove("toggleReturnOn");
//             document.querySelectorAll(".return")[0].classList.add("toggleReturnOff");
// 			for (var i = 1; i < document.querySelectorAll(".return").length; i++) {
// 			// document.querySelectorAll(".return")[i].classList.remove("toggleReturnOn");
// 			// document.querySelectorAll(".return")[i].classList.add("toggleReturnOff");
// 			document.querySelectorAll(".depart")[i].classList.remove("toggleDepartOn");
// document.querySelectorAll(".depart")[i].classList.add("toggleDepartOff");
// 		}
			
	

}
function displayMultiCity(){
//Remove return textbox
document.querySelector(".return").classList.add("toggleReturnOff");
document.querySelector(".return").classList.remove("toggleReturnOn");
for (var i = 0; i < document.querySelectorAll(".fromTo").length; i++) {
document.querySelectorAll(".fromTo")[i].classList.remove("fromTo-toggleOff");
document.querySelectorAll(".fromTo")[i].classList.add("fromTo-toggleOn");
document.querySelectorAll(".depart")[i].classList.remove("toggleDepartOff");
document.querySelectorAll(".depart")[i].classList.add("toggleDepartOn");
}

}

document.getElementById("oneWay").addEventListener("click",displayOneWay); 
document.getElementById("roundTrip").addEventListener("click",displayRoundTrip); 
document.getElementById("multiCity").addEventListener("click",displayMultiCity); 
document.querySelector("#oneWay").checked=true;
displayOneWay();