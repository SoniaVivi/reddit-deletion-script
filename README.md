# Reddit Deletion Script

## Features

- Editing and deleting comments, separately or both combined

- Iterates through all placeholder edit messages

- Deleting posts

- Exclude subreddits or only include selected subreddits

## How to use

1. Select and copy index.js

2. Open DevTools by pressing F12

3. Paste the script in the tab titled "Console" then press Enter

4. Type DeletionScript.start("**COMMAND**") then press Enter

### Start Commands

---

- comments - Edits and deletes comments

- posts

- all - Edits and deletes comments, deletes posts

- only edit comments

- only delete comments

### Only modify posts/comments from X subreddit

---

Change `exactSubredditMatch` on line 12 from `false` to `true`

On line 13 add subreddits in the square brackets. Example:

`const exactMatch = ["subreddit_a", "subreddit_b", "subreddit_c"];`

### Exclude posts/comments from X subreddit

---

On line 15 add subreddits in the square brackets. Example:

`const excludeSubreddits = ["subreddit_a", "subreddit_b", "subreddit_c"].map((x) => x.toLowerCase());`

### Edit messages

---

The default edit message is `"#**[*USER WAS BANNED FOR THIS POST*]**"`

To change, add any number of messages to `placeholderEditMessages` on line 10. Example:

`const placeholderEditMessages = ["Placeholder Edit Message", "Edit Message", "Message"];`

The script will iteratively use each message.

## Planned Features

- Exclude posts/comments if older/younger than DATE

- Exclude posts/comments if scores is above or below a certain amount
