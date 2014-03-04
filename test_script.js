# $language = "JScript"
# $interface = "1.0"

var error_cnt = [0, 0, 0, 0];
var error_msg = ["boot failed", "stack corruption detected", "CPU#0 stuck for", "Exit zygote because system server"];

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
	crt.Screen.SendKey(txt);
}

function wait_string(txt,timeout)
{
	var screen = crt.Screen;
	return screen.WaitForString(txt,timeout);
}
function run_reboot_script(loops)
{
	var loop=0;
	var result;
	var abnormal_quit = 0;

	var now = new Date();
	var date_str = "";
	date_str += now.getYear();
	date_str += ".";
	date_str += (now.getMonth()+1);
	date_str += ".";
	date_str += now.getDate();
	date_str += ".";
	date_str += now.getHours();
	date_str += ".";
	date_str += now.getMinutes();
	date_str += ".";
	date_str += now.getSeconds();

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	fso.CreateFolder(date_str);

	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var f = fso.OpenTextFile(date_str+"/stat.txt", ForWriting, true);
	f.writeLine("*** start ***");
	var current = new Date();
	f.writeLine("Start on ["+current.toString()+"]");

	while (loop++<loops)
	{
		crt.session.LogFileName = date_str+"/log"+loop+".txt";
		crt.session.Log(1); /* start logging */
		//wait_string("adb_open", 40); /* wait kernel boot up. put here to let kernel message logged */	

		var tries = 0;
		do
		{
			send_string("\ngetprop\n");
			result = wait_string("[dev.bootcomplete]: [1]", 3);
			tries++;
		} while (result == 0 && tries < 20);

		if (result == 0)
		{
			abnormal_quit = 1;
			error_cnt[0]++;
			crt.session.Log(0); /* stop logging */
			break;
		}

		send_string("\nreboot\n");
		crt.session.Log(0); /* stop logging */
		crt.Screen.clear();
	}

	if (abnormal_quit)
		f.writeLine("Abnormal quit. Test times: "+loop);
	for (var i=0; i<4; i++)
		f.writeLine(""+error_cnt[i]+" - "+error_msg[i]);
	var current = new Date();
	f.writeLine("End on ["+current.toString()+"]");
	f.writeLine("*** end ***");
	f.close();

	return loop;
}
function main()
{
	var msg;
	var count = 1000;
	crt.Screen.clear();
	crt.session.Log(0);
	send_string("\n");

	var ret = run_reboot_script(count);

	msg = "";
	msg += "Total "+count+" times, "+ret+" accomplished.\n"
	for (var i=0; i<4; i++)
		msg += error_cnt[i]+" - "+error_msg[i]+"\n";
	crt.Dialog.MessageBox(msg);
}