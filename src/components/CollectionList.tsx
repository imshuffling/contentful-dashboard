import React from 'react';

import { EntrySys, ContentType } from '@contentful/app-sdk';
import { HelpText, Table, TableHead, TableCell, TableRow, TableBody, Tag, SkeletonRow, Button, Flex } from '@contentful/forma-36-react-components';

function getEntryStatus(entrySys: EntrySys) {
  if (!!entrySys.archivedVersion) {
    return <Tag tagType="featured">archived</Tag>;
  } else if (!!entrySys.publishedVersion && entrySys.version == entrySys.publishedVersion + 1) {
    return <Tag tagType="positive">published</Tag>;
  } else if (!!entrySys.publishedVersion && entrySys.version >= entrySys.publishedVersion + 2) {
    return <Tag tagType="primary">changed</Tag>;
  }
  return <Tag tagType="warning">draft</Tag>;
}

interface CollectionListProps {
  entries: any;
  contentTypes: ContentType[];
  onClickItem: (entryId: string) => void;
}

export default function CollectionList({
  contentTypes,
  entries,
  onClickItem,
}: CollectionListProps) {
  // Loading state.

    // <TableRow className="f36-margin-top--m">
    //   {Array(3)
    //     .fill('')
    //     .map((_, i) => (
    //       <TableCell key={i} title="loading"/>
    //     ))}
    // </TableRow>


  if (!entries) {
    return (
      <Table className="f36-margin-top--m">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Content Type</TableCell>
          <TableCell>Updated</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
        <TableBody>
        {Array(3).fill('').map((_, i) => ( <SkeletonRow key={i} /> ))}
        </TableBody>
      </Table>
    );
  }

  if (entries.length) {
    return (
      <Table className="f36-margin-top--m">
      <TableHead>
        <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Content Type</TableCell>
        <TableCell>Updated</TableCell>
        <TableCell>Status</TableCell>
      </TableRow>
    </TableHead>
      <TableBody>
        {entries.map((entry: any) => {
          const contentType =
            contentTypes.length &&
            contentTypes.find((ct) => ct.sys.id === entry.sys.contentType.sys.id);
          const date_options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

          return (
            <TableRow key={entry.sys.id} onClick={() => onClickItem(entry.sys.id)} className="cr-pointer poc-table">
              <TableCell>
                {(contentType && entry.fields[contentType.displayField] && entry.fields[contentType.displayField]['en-US']) || 'Untitled'}
              </TableCell>
              <TableCell style={{ textTransform: 'capitalize'}}>{entry.sys.contentType.sys.id}</TableCell>
              <TableCell>{new Date(entry.sys.updatedAt).toLocaleDateString('en-US', date_options)}</TableCell>
              <TableCell><Flex justifyContent="space-between" alignItems="center"><span>{getEntryStatus(entry.sys)}</span><Button size="small">Edit</Button></Flex></TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>

    );
  }

  // No entries found (after fetching/loading).
  return <HelpText className="f36-margin-top--m">No entries found.</HelpText>;
}
