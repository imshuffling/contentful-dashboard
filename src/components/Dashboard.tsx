import React, { useEffect, useState } from 'react';

import { ContentType, PageExtensionSDK } from '@contentful/app-sdk';
import { TabPanel, Heading, Paragraph, Button } from '@contentful/forma-36-react-components';
import { ProductIcon } from '@contentful/forma-36-react-components/dist/alpha';

import Collection from './Collection';
import CollectionList from './CollectionList';

interface DashboardProps {
  sdk: PageExtensionSDK;
  contentTypes: ContentType[];
}

interface CollectionsState {
  total: number | null;
  published: number | null;
  scheduled: number | null;
  recent: any[] | null;
}

export default function Dashboard({ sdk, contentTypes }: DashboardProps) {
  const [data, setData] = useState<CollectionsState>({
    total: null,
    published: null,
    scheduled: null,
    recent: null,
  });

  //  TODO Get user tag based on current logged in USER
  //  Use variable when creating new entry
  //  user.spaceMembership.roles // user.tag???
  // const getUserRole = () => {
  //   if (sdk.user.spaceMembership.admin === false ) {

  //   }
  // }


  const entryData = {
    metadata: {
      tags: [
        {
          sys: {
            type: 'Link',
            linkType: 'Tag',
            id: 'countryUk',
          }
        }
      ]
    }
  }

  // Create new Post with current logged in User Tag(s)
  const createPost = async () => {

  if (sdk.user.spaceMembership.admin === false ) {
    alert('Yoooooo I\'m not admin')
  }

    // if (sdk.user.spaceMembership.admin === false ) {
      const newEntry = await sdk.space.createEntry('post', entryData);
      sdk.navigator.openEntry(newEntry.sys.id);
    // }
  }

  useEffect(() => {
    async function fetchData() {
      // Fetch some basic statistics.
      console.log("sdk.user.spaceMembership.roles", sdk.user.spaceMembership.roles)
      console.log("sdk.user.spaceMembership.admin", sdk.user.spaceMembership.admin)
      console.log("sdk.user.spaceMembership", sdk.user.spaceMembership)

      const [total, published, scheduled] = await Promise.all([
        sdk.space
          .getEntries()
          .then((entries) => entries.total)
          .catch(() => 0),
        sdk.space
          .getPublishedEntries()
          .then((entries) => entries.total)
          .catch(() => 0),
        sdk.space
          .getAllScheduledActions()
          .then((entries) => entries.length)
          .catch(() => 0),
      ]);

      setData({ ...data, total, published, scheduled });

      // Fetch some entries were last updated by the current user.
      const recent = await sdk.space
        .getEntries({ 'sys.updatedBy.sys.id': sdk.user.sys.id, limit: 10 })
        .then((entries) => entries.items)
        .catch(() => []);


        console.log(recent)

      // Set the final data. Loading complete.
      setData({ total, published, scheduled, recent });
    }

    fetchData();
  }, []);

  return (
    <TabPanel id="dashboard" className="f36-margin-top--xl">
      <div className="f36-margin-bottom--l">
        <Button onClick={createPost}>Create Post</Button>
      </div>

      {console.log(data)}

      <div id="collections">
        <Collection label="Total entries" value={data.total} />
        <Collection label="Published entries" value={data.published} />
        <Collection label="Scheduled entries" value={data.scheduled} />
      </div>

      <div className="f36-margin-top--xl">
        <Heading element="h2">Your recent Posts</Heading>
        <Paragraph>These entries were most recently updated by you.</Paragraph>
        <CollectionList
          contentTypes={contentTypes}
          entries={data.recent}
          onClickItem={(entryId) => sdk.navigator.openEntry(entryId)}
        />
      </div>
    </TabPanel>
  );
}
