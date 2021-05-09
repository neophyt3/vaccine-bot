# Vaccine Bot to track availability

## What is this?

This is a small Node.js program to alert when vaccine is available.
It was created because of difficulty in booking for vaccine shot,
official website have limited the shots and very rarely the portal allows
for allowing to schedule the appointment.

So I made this script which runs in background at defined interval(default 5 sec)
and displays a notification when booking is available so that I can quickly
open the website and book the appointment.

With this I kept running in background from morning and at evening the portal
allowed for booking which I got to know from the notification.

## Requirements

* Node.js version 15+

## How To Setup

* clone this repo
* go to the repo root directory in your powershell or bash shell or terminal
* do `npm i`
* then duplicate sample.env and rename it to .env
* enter the details like district id and date in 'd-m-Y' format eg. 10-05-2021
* also change the location filter as per your nearby location comma separated list
* then in your terminal enter the command as per your OS
  * Windows 10: `while (1) {node index.js; sleep 5}`
  * Linux/Mac: `watch -n 5 node index.js`

## License

Use it at your own risk
  