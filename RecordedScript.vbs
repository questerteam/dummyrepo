#$language = "VBScript"
#$interface = "1.0"

crt.Screen.Synchronous = True

' This automatically generated script may need to be
' edited in order to work correctly.

Sub Main
	crt.Screen.Send chr(27) & "[3" & chr(126) & chr(27) & "[B" & chr(27) & "[3" & chr(126) & chr(27) & "[B" & chr(27) & "[3" & chr(126) & chr(27) & "[B"
End Sub
