# How to contribute to the Digit Reader project

## Development Environment

* [Node.js v4.2.x](http://nodejs.org) — or `brew install nvm & nvm install 4.2` if you have [homebrew](http://brew.sh).
* You might want to run this within a [Docker](http://docker.io) container or [Vagrant](http://www.vagrantbox.es) VM.

## Development Process

All development is to follow the following simple 4 step setup process:

1. Fork this repo into your own GitHub account
2. clone your fork to your local development machine
3. Set this repo as the `upstream` repo `git remote add upstream git@github.com:davesag/digit_reader.git`
4. Disallow direct pushing to upstream `git remote set-url --push upstream no_push`

And then, for each feature, follow these simple steps:

1. Create a "feature branch" for the change you wish to make. See below for how to name branches.
2. Push that feature branch to your fork. `git push -u origin {branchname}`
3. Now work on your changes locally until you are happy the issue is resolved. See below for how to name commit messages.

Once you have done with your changes, and all tests pass, and coverage is good, and you've comitted all of your changes as you went:

1. Use GitHub to raise a Pull Request. Add labels as appropriate. Then paste the url of the PR into the #g3ms Slack channel with a request for someone to please review the changes. See below for how to name pull requests.
2. If other people have also merged changes in, and you can't merge your PR automatically you'll need to `rebase` their changes into your changes and then `--force` push the resulting changes.
3. Respond to any comments as appropriate, pushing further changes as appropriate.
4. When all comments are dealt with merge the PR and delete your feature branch.

You may have multiple PRs to merge, and Github will tell you if,  by merging you've encountered any conflicts.  If you have, rebase and `git push --force` if necessary, then, In your command-line:

1. `git checkout master`
2. `git pull upstream master` to get the latest code.
3. `git branch -D {branchname}` to delete the old feature branch.
4. `git push` your updated master to your fork,

and begin the cycle again.

**Note** you will *never* push changes directly to the upstream project, only ever to your local fork. Changes may only be introduced into the upstream project via a properly reviewed pull request.

## Naming things

There are various systems, including GitHub itself, which will pick up the issue numbers from commit messages and pull requests and automatically associate them with the issues. It is therefore desirable to use a formal naming scheme for branches, commit messages and pull requests.

### Branches

Branches must be named per the following pattern `{github issue number}_{some_descriptive_text}` — so for example, if you are working on issue 1 with the title "do the thing", call your branch `1_do_the_thing`. Obviously use your common sense to avoid making the branch names too long.

To create a branch `git checkout -b {branchname}`

### Commit Messages

When commiting something use the `-m` flag to add a short commit message of the format `#{github issue number} summary of what you changed`.  So for example if you are working on issue 1 and you added a method to the `aardvark_controller` you might use the following commit message `"#1 added anteater method to aardvark controller"`

Commit messages ought to be in the past tense.

In general try to group file changes wherever appropriate, so if your controller change also involved updating something in a helper file, the one commit message can happily encompas the changes to both files. The message ought to reflect the main aim of the change.

### Pull Requests

Pull requests must be named as follows `[issue type, #issue number] high level description of change`.  The following Issue Types are recognised

* `Bug Fix` - the change fixes a bug
* `Test` — the change implements or fixes a test
* `Feature` - the change adds or removes a feature
* `Documentation` — The change is a documentation only change
* `Optimisation` - The change is an optimisation or refactoring of the code base without any functional changes

If your change does not fit any of these categories you may use `n/a`. Likewise if your change is not tied to an issue number you may also use `n/a`.

So to use the above example your Pull Request would be named `[Feature, #1] added anteater to ardvark`
