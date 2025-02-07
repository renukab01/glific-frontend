import { GET_USERS_QUERY, FILTER_USERS, USER_COUNT, GET_USER_ROLES } from 'graphql/queries/User';
import { UPDATE_USER } from 'graphql/mutations/User';
import { USER_LANGUAGES } from 'graphql/queries/Organization';
import { GET_COLLECTIONS } from 'graphql/queries/Collection';
import { GET_ROLE_NAMES } from 'graphql/queries/Role';

const GET_ROLES_MOCK = {
  request: {
    query: GET_USER_ROLES,
    variables: {},
  },
  result: {
    data: {
      roles: ['Admin', 'Glific admin', 'Manager', 'No access', 'Staff'],
    },
  },
};

const GET_USER_MOCK = {
  request: {
    query: GET_USERS_QUERY,
    variables: { id: '1' },
  },
  result: {
    data: {
      user: {
        user: {
          id: '1',
          name: 'Staff',
          phone: '919999988888',
          isRestricted: false,
          roles: ['Staff'],
          accessRoles: [
            {
              id: '2',
              label: 'Staff',
            },
          ],
          groups: [
            {
              id: '2',
              label: 'Optout contacts',
            },
          ],
        },
      },
    },
  },
};

const MANAGER_USER_MOCK = {
  request: {
    query: GET_USERS_QUERY,
    variables: { id: '1' },
  },
  result: {
    data: {
      user: {
        user: {
          id: '1',
          name: 'Manager',
          phone: '919999988777',
          isRestricted: false,
          roles: ['manager'],
          accessRoles: [
            {
              id: '3',
              label: 'Manager',
            },
          ],
          groups: [
            {
              id: '2',
              label: 'Optout contacts',
            },
          ],
        },
      },
    },
  },
};

const ADMIN_USER_MOCK = {
  request: {
    query: GET_USERS_QUERY,
    variables: { id: '1' },
  },
  result: {
    data: {
      user: {
        user: {
          id: '1',
          name: 'Admin',
          phone: '919999984444',
          isRestricted: false,
          roles: ['admin'],
          accessRoles: [
            {
              id: '4',
              label: 'Admin',
            },
          ],
          groups: [
            {
              id: '2',
              label: 'Optout contacts',
            },
          ],
        },
      },
    },
  },
};

const GET_USER_LANGUAGE_MOCK = {
  request: {
    query: USER_LANGUAGES,
    variables: {},
  },
  result: {
    data: {
      currentUser: {
        user: {
          organization: {
            activeLanguages: [
              {
                id: '1',
                label: 'English',
                locale: 'en',
                localized: true,
              },
              {
                id: '2',
                label: 'Hindi',
                locale: 'hi',
                localized: true,
              },
            ],
            defaultLanguage: {
              id: '1',
              label: 'English',
            },
          },
        },
      },
    },
  },
};

const GET_GROUPS = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      filter: {},
      opts: { limit: null, offset: 0, order: 'ASC' },
    },
  },
  result: {
    data: {
      groups: [
        {
          id: '3',
          isRestricted: false,
          label: 'Default Group',
        },
        {
          id: '1',
          isRestricted: false,
          label: 'Optin contacts',
        },
        {
          id: '2',
          isRestricted: false,
          label: 'Optout contacts',
        },
        {
          id: '4',
          isRestricted: true,
          label: 'Restricted Group',
        },
      ],
    },
  },
};

const updateUserMock = (input?: any) => ({
  request: {
    query: UPDATE_USER,
    variables: {
      id: '1',
      input,
    },
  },
  result: {
    data: {
      updateUser: {
        errors: null,
        user: {
          groups: [
            {
              id: '2',
              label: 'Optout contacts',
            },
          ],
          id: '1',
          isRestricted: false,
          name: 'Staff',
          phone: '919999988888',
          roles: ['Admin'],
        },
      },
    },
  },
});

const UPDATE_USER_DEMOTE_ADMIN_MOCK = {
  request: {
    query: UPDATE_USER,
    variables: {
      id: '1',
      input: {
        name: 'Admin',
        isRestricted: false,
        addRoleIds: ['1'],
        deleteRoleIds: ['4'],
        groupIds: ['2'],
      },
    },
  },
  result: {
    data: {
      updateUser: {
        errors: null,
        user: {
          groups: [
            {
              id: '2',
              label: 'Optout contacts',
            },
          ],
          id: '1',
          isRestricted: false,
          name: 'Admin',
          phone: '91999994444',
          roles: ['Staff'],
        },
      },
    },
  },
};

const UPDATE_USER_MULTIPLE_ROLES_MOCK = {
  request: {
    query: UPDATE_USER,
    variables: {
      id: '1',
      input: {
        name: 'Staff',
        isRestricted: false,
        addRoleIds: ['3'],
        deleteRoleIds: [],
        groupIds: ['2'],
      },
    },
  },
  result: {
    data: {
      updateUser: {
        errors: null,
        user: {
          groups: [
            {
              id: '2',
              label: 'Optout contacts',
            },
          ],
          id: '1',
          isRestricted: false,
          name: 'Staff',
          phone: '919999988888',
          roles: ['Admin', 'Staff'],
        },
      },
    },
  },
};

export const getRoleNamesMock = {
  request: {
    query: GET_ROLE_NAMES,
    variables: {},
  },
  result: {
    data: {
      accessRoles: [
        { __typename: 'AccessRole', id: '1', isReserved: true, label: 'Admin' },
        { __typename: 'AccessRole', id: '2', isReserved: true, label: 'Staff' },
        { __typename: 'AccessRole', id: '3', isReserved: true, label: 'Manager' },
        { __typename: 'AccessRole', id: '4', isReserved: true, label: 'No access' },
      ],
    },
  },
};

const emptyRolesMock = {
  request: {
    query: GET_ROLE_NAMES,
    variables: {},
  },
  result: {
    data: {
      accessRoles: null,
    },
  },
};

export const STAFF_MANAGEMENT_MOCKS = [
  GET_USER_MOCK,
  GET_ROLES_MOCK,
  GET_USER_LANGUAGE_MOCK,
  GET_GROUPS,

  UPDATE_USER_MULTIPLE_ROLES_MOCK,
  getRoleNamesMock,
  updateUserMock({
    name: 'Staff',
    isRestricted: false,
    addRoleIds: ['3'],
    deleteRoleIds: ['2'],
    groupIds: ['2'],
  }),
  updateUserMock({
    name: 'Staff',
    isRestricted: false,
    addRoleIds: [],
    deleteRoleIds: [],
    groupIds: ['2'],
  }),
];

export const STAFF_MANAGEMENT_MOCKS_WITH_EMPTY_ROLES = [
  GET_USER_MOCK,
  GET_ROLES_MOCK,
  GET_USER_LANGUAGE_MOCK,
  GET_GROUPS,
  emptyRolesMock,
];

export const STAFF_MANAGEMENT_MOCKS_MANAGER_ROLE = [
  GET_ROLES_MOCK,
  GET_USER_LANGUAGE_MOCK,
  GET_GROUPS,
  MANAGER_USER_MOCK,
  UPDATE_USER_MULTIPLE_ROLES_MOCK,
  getRoleNamesMock,
];

export const STAFF_MANAGEMENT_MOCKS_ADMIN_ROLE = [
  GET_ROLES_MOCK,
  GET_USER_LANGUAGE_MOCK,
  GET_GROUPS,
  UPDATE_USER_DEMOTE_ADMIN_MOCK,
  ADMIN_USER_MOCK,
  getRoleNamesMock,
];

export const USER_COUNT_MOCK = {
  request: {
    query: USER_COUNT,
    variables: { filter: {} },
  },
  result: {
    data: {
      countUsers: 5,
    },
  },
};

const createUserMockData = new Array(5).fill(null).map((val, idx) => {
  const index = idx + 1;
  const roles = ['Admin', 'Glific_admin', 'Staff', 'Manager', 'Manager'];
  return {
    id: `${index}`,
    name: `NGO Main Account${index}`,
    phone: `9198765432${index}`,
    accessRoles: [{ label: roles[idx] }],
    groups: [],
    contact: {
      id: `${index}`,
    },
  };
});

export const FILTER_USER_MOCK = {
  request: {
    query: FILTER_USERS,
    variables: {
      filter: {},
      opts: {
        limit: 50,
        offset: 0,
        order: 'ASC',
        orderWith: 'name',
      },
    },
  },
  result: {
    data: {
      users: createUserMockData,
    },
  },
};
