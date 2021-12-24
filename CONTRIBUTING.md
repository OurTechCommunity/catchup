# Welcome, Contributors! 😄

-   Please check the [issues tab](https://github.com/OurTechCommunity/catchup/issues) for things to work on.
-   Please raise an [issue](https://github.com/OurTechCommunity/catchup/issues) for adding a new feature or for reporting a bug, if it has not already been raised.

## Tech Stack

-   Front end: HTML, CSS, JS, Asciidoctor
-   Back end: Express.js, [Deta Micro](https://docs.deta.sh/docs/home/#deta-micros), [Deta Base](https://docs.deta.sh/docs/home/#deta-base)

## Local Setup

-   Fork this repo. (Top right corner.)
-   Clone the forked repo using the [`git clone`](https://harshkapadia2.github.io/git_basics/#_git_clone) command.
-   `cd` into the cloned repo directory.
-   Run `npm install` in the root directory of the project to install all dependencies.
-   [Install Asciidoctor.](https://asciidoctor.org/#installation)
-   Add a `.env` file in the root directory of the project with variables as mentioned in the [`sample.env` file](https://github.com/OurTechCommunity/catchup/blob/main/sample.env) and add random strings as values. This will prevent errors.

    Example: `DETA_PROJECT_KEY=lsjdbvkjsdbksbdkcjs`

-   Run `npm run test` in the root directory of the project to build [the summary site](https://catchup.ourtech.community/summary) once and start a hot reload server. The web app should be accessible on `http://localhost:<port>`. (The port will appear in the server console.)
-   The summary site uses a Static Site Generator called [Asciidoctor](https://asciidoctor.org).
    -   Run the command `sh util/build.sh` in the root directory of the project to build [the summary site](https://catchup.ourtech.community/summary).
    -   The site should be accessible at `http://localhost:<port>/summary` or `http://localhost:<port>/summary/<summary_number>` after running `npm run test` in the root directory of the project. (The port will appear in the server console.)
        -   The `npm run test` builds the summary site just once, so for further Asciidoctor changes to reflect, the command will have to be run again.
-   Make contribution(s)

    -   Write meaningful commit messages and include the number (`#`) of the issue being resolved (if any) at the end of the commit message.

        Example: `:bug: fix: Resolve 'isCorrect' function error (#0)`

-   Open a Pull Request (PR).
    -   [Learn how to open a PR](https://github.com/firstcontributions/first-contributions).
    -   Solve one issue per PR, **without any extra changes**.
    -   **Include extra changes in a separate PR.**

## Further Help

If any further help is needed, do not hesitate to contact the organiser ([Harsh Kapadia](https://harshkapadia.me)) via [OTC's Telegram](https://t.me/OurTechComm), [Twitter @harshgkapadia](https://twitter.com/harshgkapadia), [LinkedIn](https://www.linkedin.com/in/harshgkapadia) or e-mail ([harsh@ourtech.community](mailto:harsh@ourtech.community)). An [issue](https://github.com/OurTechCommunity/catchup/issues) can be raised as well.
