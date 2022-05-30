//eslint-disable-next-line no-unused-vars
const DeletionScript = (() => {
  const defaultEditMessage = "#**[*USER WAS BANNED FOR THIS POST*]**";
  // Delay must be >= 4500 to prevent forced slowdown
  const editDelay = 4500;
  const afterEditDeleteDelay = 60000;
  const deleteDelay = 4000;
  let editIndex = 0;
  const placeholderEditMessages = [];

  const exactSubredditMatch = false;
  const exactMatch = [];

  const excludeSubreddits = [].map((x) => x.toLowerCase());

  const forEachPostable = async (action, delay, postables) => {
    for (let i = 0; i < postables.length; i += 1) {
      await new Promise((resolve) =>
        setTimeout(() => {
          action(postables[i]);
          resolve(true);
        }, delay)
      );
    }
    return true;
  };

  const isValidSubreddit = (postable) => {
    const subreddit = getSubreddit(postable);

    if (
      (exactSubredditMatch && !exactMatch.includes(subreddit)) ||
      excludeSubreddits.includes(subreddit.toLowerCase())
    ) {
      return false;
    }

    return true;
  };

  const removeInvalidPostables = (postables) =>
    [...postables.values()].filter((postable) => isValidSubreddit(postable));

  const getComments = () =>
    removeInvalidPostables(document.querySelectorAll(".comment"));

  const getPosts = () =>
    removeInvalidPostables(document.querySelectorAll(".link"));

  const getSubreddit = (postable) => postable.dataset.subreddit;
  const editComment = (comment) => {
    comment.querySelector(".edit-usertext").click();

    if (!placeholderEditMessages.length) {
      comment.querySelector("textarea").value = defaultEditMessage;
    } else {
      comment.querySelector("textarea").value =
        placeholderEditMessages[editIndex];
      editIndex =
        editIndex < placeholderEditMessages.length - 1 ? editIndex + 1 : 0;
    }

    comment.querySelector(".save").click();
  };

  const editComments = async () => {
    let editedComments = [];
    await forEachPostable(
      (comment) => {
        editComment(comment);
        editedComments.push(comment);
      },
      editDelay,
      getComments()
    );
    return editedComments;
  };

  const deletePostables = async (postables) => {
    await forEachPostable(
      (postable) => {
        postable.querySelector(`[data-event-action="delete"]`).click();
        postable
          .querySelector(".option.error.active")
          .querySelector(".yes")
          .click();
      },
      deleteDelay,
      postables
    );
    return true;
  };

  const loggingMessages = (key) => {
    const messages = {
      deletePosts: "Deleting Posts",
      editComments: "Editing comments",
      deleteDelay: `Taking a ${
        afterEditDeleteDelay / 1000
      } second break before deleting comments`,
      deleteComments: "Deleting Comments",
      commandNotFound:
        "Command not found, valid commands (with quotation marks) are: " +
        '"comments", "posts",  "all", "only delete comments", and ' +
        '"only edit comments"',
    };
    console.log(messages[key]);
  };

  const start = async (targetType) => {
    if (
      ![
        "comments",
        "posts",
        "all",
        "only delete comments",
        "only edit comments",
      ].includes(targetType)
    )
      return loggingMessages("commandNotFound");

    if (["posts", "all"].includes(targetType)) {
      loggingMessages("deletePosts");
      await deletePostables(getPosts());
    }

    if (["comments", "all", "only edit comments"].includes(targetType)) {
      loggingMessages("editComments");
      await editComments();
    }

    if (["comments", "all", "only delete comments"].includes(targetType)) {
      loggingMessages("deleteDelay");
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, afterEditDeleteDelay)
      );
      loggingMessages("deleteComments");
      await deletePostables(getComments());
    }
  };
  return { start };
})();
