const crypto = require('crypto');
const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

module.exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const { profileName, avatar } = configOptions;

  console.log(`Plugin options: ${JSON.stringify(configOptions)}`);

  if (!profileName) {
    throw new Error('`profileName` is required for gatsby-source-gravatar');
  }

  // const apiUrl = new URL(`https://secure.gravatar.com/${profileName}.json`);
  // apiUrl.search = new URLSearchParams({});
  const res = await fetch(`https://secure.gravatar.com/${profileName}.json`);
  if (!res.ok) {
    throw new Error(`Error retrieving gravatar profile: ${apiUrl}`);
  }
  const userProfile = (await res.json()).entry[0];
  const nodeMeta = {
    id: createNodeId(`gravatar-profile-${profileName}`),
    parent: null,
    children: [],
    internal: {
      type: `GravatarProfile`,

      contentDigest: createContentDigest(userProfile),
    },
  };
  const node = Object.assign({}, userProfile, nodeMeta);
  console.log('Creating node');
  createNode(node);
};

const createLocalImageNode = async ({
  url,
  parent,
  store,
  cache,
  createNode,
  createNodeId,
  createContentDigest,
  createParentChildLink,
}) => {
  const fileNode = await createRemoteFileNode({
    url,
    store,
    cache,
    createNode,
    createNodeId,
  });

  console.log(fileNode);

  const localImageNode = {
    id: createNodeId(`${parent.id} >>> LocalImage`),
    // url,
    parent: parent.id,
    children: [],
    internal: {
      type: `LocalImage`,
    },
  };
  localImageNode.internal.contentDigest = createContentDigest(localImageNode);
  createNode(localImageNode);

  fileNode.parent = localImageNode.id;
  createParentChildLink({
    parent: localImageNode,
    child: fileNode,
  });

  return localImageNode;
};

module.exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions;
  if (node.internal.type !== `GravatarProfile`) {
    return;
  }
  console.log('hello');
  const localImageNode = await createLocalImageNode({
    url: node.thumbnailUrl,
    parent: node,
    store,
    cache,
    createNode,
    createNodeId,
    createContentDigest,
    createParentChildLink,
  });
  createParentChildLink({
    parent: node,
    child: localImageNode,
  });
};
