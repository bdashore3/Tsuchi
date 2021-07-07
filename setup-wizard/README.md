# MangaUpdates Setup Wizard

The setup wizard contains a binary to create your user.json file. This file is used for official/self hosted servers.

## Official server

Looking to be added on the official server? You have to be in the [discord](https://discord.gg/pswt7by) and ping kingbri or nmn to be added.

The official server is invite only to minimize server costs. If you want to host your own instance of MangaUpdates, please take a look at the [server README](https://github.com/bdashore3/MangaUpdates/tree/default/server/README.md).

## Setup

## Binary downloads

The setup binaries are distributed in Github release format through Github Actions. To download the latest commit binary:

-   Head to the [releases page](https://github.com/bdashore3/MangaUpdates/releases)
-   Navigate to the latest release
-   Download the setup wizard archive under assets.

## JSON setup

Once you download the binary, you can run an executable which will open the CLI interface.

Prerequisites:

-   A Windows/macOS/Linux machine to run the software on

Steps:

1. Unzip the setup wizard
2. Place your OS-specific binary inside a folder, this will serve as the "project root" from now on
3. Add your manga backup or manual manga list
4. Grab your service(s) `api_name` and `api_token`
5. Run the binary file and follow the steps
   a. Double click the .exe on Windows
   b. For macOS and Linux, run this binary in the terminal using this one-step command: `cd project_root && chmod +x mangaupdates-setup-os && ./mangaupdates-setup-os`. Replace `project_root` and `os` with the appropriate values.
6. After the setup wizard is finished, you should see a `username.json` file in the project root. Use this for the server.

## Questions?

Please join the Discord [support server](https://discord.gg/pswt7by) and get the `king-updates` role.
