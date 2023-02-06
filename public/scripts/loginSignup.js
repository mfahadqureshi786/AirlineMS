/*window.onload = function() {
 document.querySelector('form.signupForm').classList.add('hideSignup');
};
*/
function switchLoginSignup(){
var class_l=document.querySelector('form.loginForm').classList.contains('hideLogin');
var class_s=document.querySelector('form.signupForm').classList.contains('hideSignup');
if(class_l)
{
	document.querySelector('form.loginForm').classList.remove('hideLogin');
    document.querySelector('form.signupForm').classList.add('hideSignup');
}
else if(class_s)
{

document.querySelector('form.signupForm').classList.remove('hideSignup');
document.querySelector('form.loginForm').classList.add('hideLogin');
}
}