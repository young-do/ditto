'use client';

import React, { useEffect } from 'react';
import SimpleHeader, { SIMPLE_HEADER_HEIGHT } from '@/components/layouts/SimpleHeader';
import MainLayout from '@/components/layouts/MainLayout';
import BucketItemList from '@/components/bucketItem/BucketItemList';
import { Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useFetchBucketFolderById } from '@/hooks/bucketlist/useFetchBucketFolderById';
import styled from '@emotion/styled';
import ConditionalRabbitIcon from '@/components/bucketItem/ConditionalRabbitIcon';
import { useUser } from '@/store/useUser';
import { useUnreadBucketItems } from '@/hooks/bucketlist/useUnreadBucketItems';

const BucketListItem = () => {
  const { selectedGroupId, setGroupId } = useUser();
  const folderId = Number(useParams().folderId);

  const { data: bucketFolder } = useFetchBucketFolderById(folderId);
  const { setReadByFolderId } = useUnreadBucketItems();

  useEffect(() => {
    // @note: url로 바로 접근한 경우, 해당 폴더의 그룹 아이디를 selectedGroupId로 설정
    if (bucketFolder && bucketFolder.group_id !== selectedGroupId) {
      setGroupId(bucketFolder.group_id);
    }
  }, [bucketFolder, selectedGroupId, setGroupId]);

  useEffect(() => {
    // @note: 이 페이지에 접근 후 다른 페이지로 이동하면 읽음 처리한다
    return () => {
      folderId && setReadByFolderId(folderId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  return (
    <MainLayout header={<SimpleHeader />} headerHeight={SIMPLE_HEADER_HEIGHT}>
      <ListWrapper>
        <Text textStyle={'h1'} marginBottom={'12px'} minHeight={'105px'}>
          {bucketFolder?.title}
        </Text>
        <ConditionalRabbitIcon folderTitle={bucketFolder?.title ?? ''} />
        <BucketItemList />
      </ListWrapper>
    </MainLayout>
  );
};

const ListWrapper = styled.div`
  padding: 0 20px;
`;

export default BucketListItem;
