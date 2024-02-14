# ma2midicon
Rewritten from scratch code for controlling MA2 onPC - using midicon.

You need to download the entire archive from GitHub and unpack it in a location of your choice.

The code is written for Node.js - which you need to download and install exactly this version ->NODEJS version 14.17 from https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi

Before running my code, you need to start MA2.

In the global settings - enable remote login.

In the user settings, add a new user named "midicon" and set the password to "remote".

Make sure that midicon is not being used by any other application!

If it's set to In or Out in MA2, please change it to none.

Now you can run my code.

Right-click on the ma2midicon file and select - run with - then choose node.exe from the installed nodejs - you can set this application to always open this file type - (next time just double-click on the code icon)

That's it - the program automatically exchanges messages.

----------------

Description

The faders control exec 1 - 7.

The buttons above the faders 1-7 correspond to the upper two rows and the lower button respectively.

The grandmaster fader works and so does the blackout button.

The upper right buttons - correspond to action buttons from
101 - 108
116 - 123
131 - 138
145 - 153

Encoders
Encoders 1 2 3 - control the respective encoders on the screen

Clicking encoder 1 - sets the resolution to normal
Clicking encoder 2 - sets the resolution to precise
Clicking encoder - swaps encoder 3 to control as 4, and pressing again returns to control as 3

Touch keys
201 - 206
211 - 216

Page keys
allow control of faders and executors on the selected page (each works independently)

In the code, there is the possibility to change the wing setting (open with notepad and change) wing = 1; is the basic mode
wing = 2; faders and executors shifted by offset 7.

-----------------


!!! Program not work with old ma2onpc (3.1.2.5)

!! Program not work - if any executor have more then 1 row ! (thx Philipp Darpe)
