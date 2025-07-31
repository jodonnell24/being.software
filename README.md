# Being Software

A web app that makes self hosting cloud alternatives simple.

## General Roadmap

- **Cute UI for motivation:**  Svelte frontend that tells you whats up!

- **API backend:** This will be the method of how the app can be put locally on a user's machine.

- **Get one app to work:** I'll choose an app to start with and get it to the point that the user won't need to touch a terminal for the deployment process. (not sure about after that, the point is the app is in a usable stable state for the user).  

- **User Logins:** This is to access a mini dashboard, basically just http status and if the app needs to be updated, basic information that isn't required.


## App Roadmap
- **Core Backend:** 
    > Deploy and destroy target app on test cluster, using a single API call, no UI interaction yet

    > Package app as helm chart, for template for future apps

    > Deployment logic takes user input and from api call and passes it as values to the helm chart

    > Teardown logic with helm uninstall

    >Automated tests for different user situations/setups

- **UI Connection:**
    > get deploy button connection to Post endpoint

    > Deployment form functionality, for api input

    >UI states for 'loading, success, error. etc during deployment process and clear feedback

    >SECURE CREDENTIAL HANDOFF HRFEIRHUROHUERHGENGJENGUGYAGFDFNFLGRIOTJYIRHGURHTGOTNBONBUOHVU9GF7TWFE7W8FHUBNIRUHBNU9RHSE89

- **Polish and Docs:** 
    > user flow
    > write docs
    > buncha TESTS
- **Scaling:**
    > Repeat with more apps, the sample in the ui doesn't 100% reflect what apps will be in the finished project, just gives an idea of what types of apps will be there.
- **Dashboard** 
    > This will mostly just be status checks, but im thinking the dashboard won't be supperrr useful without keeping API keys and thats.. just not worth the stress lol


