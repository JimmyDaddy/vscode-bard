# Google Bard (beta) vscode extension

<p align="center">
  <img src="/assets/bard.png" alt="Example Image" width="30">
</p>

This is a vs code extension for [Google Bard(beta)](https://bard.google.com/) extension

## Features

* Chat with google bard(beta) in vscode
* Multiple answers for one question
  ![Example](./assets/sample.png)

## Extension Settings

* `vscode-bard.cookies`: Your Google Bard cookies.

## How to get cookies?

### Solution 1

* Go to <https://bard.google.com> and login.
* Open developer tools and go to `Application` tab.
* Click on `Cookies` and then `https://bard.google.com`.
* Search for `__Secure-1PSID` and copy the value.
* Paste the value `__Secure-1PSID={WHAT YOU COPIED}` in the extension settings `vscode-bard.cookies`.
* OR use shot cut `ctrl+shift+B` and paste the value.

  ![Example](./assets/getcookie.png)

### Solution 2

* Go to <https://bard.google.com> and login.
* Open developer tools and go to network tab.
* Click on any request of the host `bard.google.com` and copy the value of `Cookie` header.
* Paste the value in the extension settings `vscode-bard.cookies`.
* OR use shot cut `ctrl+shift+B` and paste the value.

**Enjoy!**
