export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const GuidePartsFragmentDoc = gql`
    fragment GuideParts on Guide {
  __typename
  title
  region
  standfirst
  metaDescription
  heroImage
  heroAlt
  driveMinsFromLondon
  readTime
  published
  quickFacts {
    __typename
    bestBase
    bestBasePrice
    bestBaseLink
    idealFor
    getThere
  }
  whyGo
  whereToStay
  whatToDo
  whereToEat
  itinerary
  proTips
  faq {
    __typename
    question
    answer
  }
  author
  authorNote
}
    `;
export const GuideDocument = gql`
    query guide($relativePath: String!) {
  guide(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...GuideParts
  }
}
    ${GuidePartsFragmentDoc}`;
export const GuideConnectionDocument = gql`
    query guideConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: GuideFilter) {
  guideConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...GuideParts
      }
    }
  }
}
    ${GuidePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    guide(variables, options) {
      return requester(GuideDocument, variables, options);
    },
    guideConnection(variables, options) {
      return requester(GuideConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/2.4/content/45e6d8c4-b278-483f-827c-fb24f002ee6f/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
