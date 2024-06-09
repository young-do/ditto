import React, { memo } from 'react';
import { useParams } from 'next/navigation';
import { useFetchBucketItems } from '@/hooks/bucketlist/useFetchBucketItems';
import BucketItem from '@/components/bucketItem/BucketItem';
import styled from '@emotion/styled';
import PartialLoader from '@/components/loading/PartialLoader';
import EmptyItem from '@/components/bucketItem/EmptyItem';
import BucketItemInput from '@/components/bucketItem/BucketItemInput';

const BucketItemList = () => {
  const folderId = Number(useParams().folderId);

  const { data: bucketItems = [], isLoading } = useFetchBucketItems(folderId);

  return (
    <>
      <BucketItemInput folderId={folderId} />
      <ListWrapper>
        {isLoading ? (
          <PartialLoader />
        ) : (
          <>
            {bucketItems?.length === 0 && <EmptyItem />}
            {bucketItems?.map((item) => (
              <BucketItem key={item.id} item={item} />
            ))}
          </>
        )}
      </ListWrapper>
    </>
  );
};

const ListWrapper = styled.ul`
  min-height: calc(100vh - 435px);
`;

export default memo(BucketItemList);
