/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { SiteMembershipRequestWithPersonPaging, SitePaging } from '@alfresco/js-api';

export const fakeLibrary: SitePaging = {
    list: {
        pagination: {
            count: 1,
            hasMoreItems: false,
            totalItems: 1,
            skipCount: 0,
            maxItems: 20
        },
        entries: [
            {
                entry: {
                    guid: 'exampleName',
                    id: 'exampleName',
                    title: 'exampleName',
                    description: 'fake-desc',
                    visibility: 'PUBLIC',
                    role: 'SiteCollaborator'
                }
            },
            { entry: { guid: 'blog', id: 'blog', title: 'blog', description: 'blog-desc', visibility: 'PUBLIC', role: 'SiteCollaborator' } }
        ]
    }
};

export const fakeLibraryListDatatableSchema = {
    'all-libs': {
        presets: {
            default: [
                {
                    key: 'id',
                    type: 'text',
                    title: 'ADF_TASK_LIST.PROPERTIES.NAME'
                }
            ]
        }
    }
} as any;

export const fakeLibraryJoinRequest: SiteMembershipRequestWithPersonPaging = {
    list: {
        pagination: {
            count: 3,
            hasMoreItems: false,
            totalItems: 3,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    createdAt: new Date(1),
                    id: 'library-1',
                    site: {
                        id: 'library-1',
                        title: 'library-1',
                        guid: 'guid',
                        visibility: 'PUBLIC'
                    },
                    person: {
                        id: 'user1'
                    } as any
                }
            },
            {
                entry: {
                    createdAt: new Date(2),
                    id: 'library-1',
                    site: {
                        id: 'library-1',
                        title: 'library-1',
                        guid: 'guid',
                        visibility: 'PUBLIC'
                    },
                    person: {
                        id: 'user2'
                    } as any
                }
            },
            {
                entry: {
                    createdAt: new Date(3),
                    id: 'library-2',
                    site: {
                        id: 'library-2',
                        title: 'library-2',
                        guid: 'guid',
                        visibility: 'PUBLIC'
                    },
                    person: {
                        id: 'user3'
                    } as any
                }
            }
        ]
    }
};
