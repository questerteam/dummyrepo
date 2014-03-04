# $language = "JScript"
# $interface = "1.0"


function sleep(seconds)
{
	crt.Sleep(seconds*1000);
}
function send_string(txt)
{
	var screen = crt.Screen;
	screen.Send(txt);
}

function send_keys(txt)
{
	crt.Screen.SendKeys(txt);
}

function wait_string(txt,timeout)
{
	var screen = crt.Screen;
	if(timeout > 0)
		return screen.WaitForString(txt,timeout);
	else
		return screen.WaitForString(txt);
}	


function main()
{	
	
	while (true)
	{
		crt.Screen.clear();
		
		wait_string("Autobooting in 1 seconds", -1); 

		send_keys("{esc}{esc}{esc}{esc}\n");

;		wait_string("#", -1); 

		send_string("\nautoupdate\n");
	}
	
}
