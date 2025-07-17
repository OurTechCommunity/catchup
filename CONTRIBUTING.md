# Welcome, Contributors! 😄

- Please check the [issues tab](https://github.com/OurTechCommunity/catchup/issues) for things to work on.
- Please raise an [issue](https://github.com/OurTechCommunity/catchup/issues) for adding a new feature or for reporting a bug, if it has not already been raised.

## Tech Stack

- Front end: HTML, CSS, JS, [Asciidoctor Jet](https://harshkapadia2.github.io/asciidoctor-jet)
- Back end: Express.js, [Deta Micro](https://docs.deta.sh/docs/home/#deta-micros), [Deta Base](https://docs.deta.sh/docs/home/#deta-base)

## Gitpod Setup

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/OurTechCommunity/catchup)

- On clicking on the above 'Open in Gitpod' button, a Gitpod Workspace with all dependencies installed will open up.
- Start the dev server by running `npm run start` in the root directory.
  - A browser window with the web app should automatically open up, but if it doesn't, `ctrl+click` the link in the terminal to open up a window.
  - NOTE: The server will have to be re-started manually to build the summary pages, as builds happen just once on starting the server.
- A [GitHub integration](https://gitpod.io/integrations) will be required if not already done. Also, make sure to give appropriate permissions to GitHub on the [Integrations page](https://gitpod.io/integrations).
- To open a PR
  - Fork this repo. (Top right corner.)
  - On Gitpod, [add the forked repo as a remote](https://harshkapadia2.github.io/git_basics/#_add_remote_repo_alias_remote_repo_url_git).
  - [Make a new Git branch](https://harshkapadia2.github.io/git_basics/#_branch_name_2) on Gitpod.
  - Make the required contribution(s) on Gitpod in the new branch.
    - Please follow the [commit message format](https://harshkapadia2.github.io/git_basics/#_commit_messagetitle).
    -   [Push the new branch to the forked repo](https://harshkapadia2.github.io/git_basics/#_command_16).
    -   [Open a PR as usual](https://github.com/firstcontributions/first-contributions#submit-your-changes-for-review) from the forked repo.

## Local Setup

-   Fork this repo. (Top right corner.)
-   Clone the forked repo using the [`git clone`](https://harshkapadia2.github.io/git_basics/#_git_clone) command.
-   `cd` into the cloned repo directory.
-   Run `npm install` in the root directory of the project to install all dependencies.
-   [Install Asciidoctor.](https://asciidoctor.org/#installation)
-   Create a `.env` file in the root directory of the project with the contents of the [`sample.env` file](https://github.com/OurTechCommunity/catchup/blob/main/sample.env). The `sample.env` file has `placeholder_text` as variable values to prevent errors.
-   Run `npm run start` in the root directory of the project to build [the summary site](https://catchup.ourtech.community/summary) once and start a hot reload server. The web app should be accessible on `http://localhost:<port>`. (The port will appear in the server console.)
-   The summary site uses a Static Site Generator called [Asciidoctor](https://asciidoctor.org).
    -   Run the command `sh util/build.sh` in the root directory of the project to build [the summary site](https://catchup.ourtech.community/summary).
    -   The site should be accessible at `http://localhost:<port>/summary` or `http://localhost:<port>/summary/<summary_number>` after running `npm run start` in the root directory of the project. (The port will appear in the server console.)
        -   The `npm run start` builds the summary site just once, so for further Asciidoctor changes to reflect, the command will have to be run again.
-   Make contribution(s)

    -   Write meaningful commit messages and include the number (`#`) of the issue being resolved (if any) at the end of the commit message.

        Example: `:bug: fix: Resolve 'isCorrect' function error (#0 #2)`

        [Commit message format](https://harshkapadia2.github.io/git_basics/#_commit_messagetitle)

-   Open a Pull Request (PR).
    -   [Learn how to open a PR](https://github.com/firstcontributions/first-contributions).
    -   Solve one issue per PR, **without any extra changes**.
    -   **Include extra changes in a separate PR.**

## Contributing to the Summary Site

-   Fork and clone the CatchUp repository.
-   Create a new branch in your forked repository locally.
-   Navigate to the **summary/sessions** directory.
-   Create a new folder named after the summary number, then add the following files:
    -   `content.adoc`
    -   `attendees.adoc`
-   In the **/util** directory, follow the instructions in the README.
-   Run the following command to generate the initial attendee handle map (ensure Node.js is installed):
    ```
    node create-attendee-handle-map.js
    ```
-   Copy the attendee names into the `attendees.adoc` file.
-   Next, execute:
    ```
    node map-handles-to-catchup-attendees.js <sum_num>
    ```
-   Review the format used in previous summaries; copy and update it with the latest discussion details.
-   For adding links, use the format (example):
    ```
    link:https://www.youtube.com/watch?v=vcp2iFzHmfwd[Profiling^]
    ```
-   Rename the CatchUp screenshot to the corresponding meeting number and add it to the **/summary/static** folder.
-   Once your changes are complete, stage and push your modifications to your repository.
-   Finally, open a pull request on the OTC CatchUp repository.

### Session Summaries & Organization Guidelines

- Summaries should capture the essence of the discussion without being overly detailed. If key context is missing, include relevant links at the end.
- The catchUp sessions follow a round-robin format where different members take turns managing the session and drafting the summary. Responsibilities can be shared if needed.
- If you know you won’t be available, please inform the team at least 24 hours in advance. Emergencies can be managed as they arise.
- Maintain a separate document for each catchUp summary so that someone else can easily pick up and complete the work if required.
- When hosting CatchUp, warmly greet new members and introduce them to OTC by explaining how each part of the community operates. Previously, sessions featured segments for introductions, project showcases, and open tech discussions.

## Git Hooks and Commit Conventions

This repo uses [Husky](https://typicode.github.io/husky) 'pre-commit' and 'commit-msg' hooks to enforce code quality and commit consistency. These hooks run automatically when one tries to create a commit.

### Pre-commit Hook

- Prettier formatting check
    -   Runs Prettier to ensure code is properly formatted.
    -   Blocks the commit if issues are found.

### Commit-msg Hook

-   Commit message check
    -   Ensures that the commit message follows the [Conventional Commits](https://www.conventionalcommits.org) spec.

### Running scripts manually

-   Prettier formatting check

```bash
$ npm run lint:check
```

-   Commit message check

```bash
npm run commitlint "<commit message>"
# OR
commitlint --edit "<commit message>"
```

### Commit Message Format

-   A commit message must follow the following format: `<type>(optional scope): <description>`

-   Examples of commit messages

    ```bash
    $ git commit -m "feat: add GitHub OAuth login" # Correct
    $ git commit -m "update(docs): revise installation instructions" # Correct
    $ git commit -m "just an unconventional commit message" # Incorrect
    ```

-   Allowed type values are mentioned in [`commitlint.config.js`](commitlint.config.js)

### Hooks setup

-   Hooks are automatically setup when the following command is run

    ```bash
    npm install
    ```

    -   This is handled by the `prepare` script in `package.json`:

    ```json
    {
    	"scripts": {
    		"prepare": "node .husky/install.mjs"
    	}
    }
    ```

-   To re-install `husky` manually

```bash
npx husky install
```

### Skipping Hooks

To skip all hook (**not recommended**, unless necessary or instructed to do so), use the `--no-verify` flag in the `git commit` command.

NOTE: Only use this if there is a specific reason to do so. Bypassing the hook means formatting or commit message errors may go unnoticed.

```bash
git commit --no-verify -m "test: commit_msg_here"
```

## Further Help

If any further help is needed, do not hesitate to contact the organiser ([Harsh Kapadia](https://harshkapadia.me)) via [OTC's Telegram](https://t.me/OurTechComm), [Twitter @harshgkapadia](https://twitter.com/harshgkapadia), [LinkedIn](https://www.linkedin.com/in/harshgkapadia) or e-mail ([harsh@ourtech.community](mailto:harsh@ourtech.community)). An [issue](https://github.com/OurTechCommunity/catchup/issues) can be raised as well.
