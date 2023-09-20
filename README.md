# <img src="/assets/bard.png" alt="Example Image" width="40" style="display: inline"> Google Bard (beta) vscode extension


This is a vs code extension for [Google Bard(beta)](https://bard.google.com/) extension

## Features

* Chat with google bard(beta) in vscode
* Multiple answers for one question
  <img src="./assets/sample.png" alt="Example Image" width="300">

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
  ![Example2](./assets/getcookie2.png)

> ***Due to Google's security policy, different regions may require different cookies. You can try setting all cookies starting with __Secure-1, or copy the entire cookie value as in Solution 2***.

**Enjoy!**
