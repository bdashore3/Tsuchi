# Setting up IFTTT

[Ifttt](https://ifttt.com) is currently the only notification service that is supported by MangaUpdates. This will be rewritten and expanded when other services come into play.

Here are the steps for setting up a notification service using IFTTT:

1. Create an account
2. Install the app on your iOS/Android device
3. Navigate to the [webhooks page](https://ifttt.com/maker_webhooks) and hit the connect switch (if you see it)
4. Once connected, hit the documentation button
5. A page should open which says **Your key is: [key here]**. Copy that key and save it for the setup wizard.
6. Now go back [home](https://ifttt.com/home) and click the `create` button to create a new applet. You should see the `If THIS then THAT` screen.

### Inside the If THIS section

-   Click add and search for the `Webhooks` service
-   Then click `Recieve a web request`
-   Enter an event name (save this name for the setup wizard!)
-   Click the `create trigger button`

### Inside the Then THAT section

-   Click add and search for the `Notifications` service
-   Select `Send a rich notification from the IFTTT app`
-   You should see a bunch of text fields
-   Here's what your rich notification configuration should look like:

```
Title
------
Value1

Message
--------
Value2

Link URL (keep blank)

Image URL
-----------
Value3
```

Value1, Value2, and Value3 can be retrieved from the `Add ingredient` button under each text field.

Here's how the ingredients correspond to MangaUpdates

```
Value1: The manga title
Value2: Chapter update string (ex. Chapter 122 updated from MangaLife)
Value3: The image URL of the manga cover
```

Once you're done with this step, click `create action`

### Finishing up

After the if THIS and then THAT sections are completed, hit the create and finish buttons to finish creating your applet!

Make sure your phone has push notifications on for IFTTT, otherwise you won't get notified.

## Questions?

Please join the Discord [support server](https://discord.gg/pswt7by) and get the `king-updates` role.
