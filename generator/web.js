module.exports = function (name) {
  const lowerCaseName = name.replace(name[0], name[0].toLowerCase());
  const template = `
import React, { useEffect, useState, useContext } from 'react';
import { useQueryList } from '@/hooks';
import { Button, Divider, Table, Space, Row, Col } from 'antd';
import { RetrieveModal, UpdateModal, CreateModal, Filter } from '@/component';
import { AppContext } from '@/store';
import request from '@/modules/request';
import { formatDate } from '@/modules/format';
import './index.scss';
    
const StatusOptions = [
    {
    value: 1,
    label: 'online'
    },
    {
    value: 0,
    label: 'offline'
    }
];

export default function authority(props) {
    const {
    loading,
    setLoading,
    pageIndex,
    setPageIndex,
    pageSize,
    listData,
    fetchData: fetchDataOrigin,
    refreshId,
    handleItemData,
    setItemData,
    itemData,
    setPageSize,
    total
    } = useQueryList({
    fetchUrl: '/demoList',
    pageSize: 20
    });
    const {
    BaseData: { authType }
    } = useContext(AppContext);
    const [retrieveModalVisible, setRetrieveModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [params, setParams] = useState({});
    useEffect(() => {
    fetchDataOrigin();
    }, []);
    const picResUrlCreateUpdate = {};
    const onTableChange = pagination => {
    if (pageSize !== pagination.pageSize) {
        setPageSize(pagination.pageSize);
        fetchDataOrigin({
        pageSize: pagination.pageSize,
        pageIndex,
        ...params
        });
    }
    if (pageIndex !== pagination.current) {
        setPageIndex(pagination.current);
        fetchDataOrigin({
        pageSize,
        pageIndex: pagination.current,
        ...params
        });
    }
    };

    const columns: any[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 60,
        filter: {
        type: 'Input',
        required: false
        }
    },
    {
        title: 'Remark',
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
        width: 150,
        filter: {
        type: 'Input',
        required: false
        },
        retrieve: {
        type: 'Text',
        index: 1
        },
        create: {
        type: 'Input',
        index: 1,
        tooltip: '备注'
        },
        update: {
        type: 'Input',
        index: 1,
        tooltip: '备注'
        }
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        width: 120,
        filter: {
        type: 'Input',
        required: false
        },
        retrieve: {
        type: 'Text',
        index: 1
        },
        create: {
        type: 'Input',
        index: 1
        },
        update: true
    },
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        align: 'center',
        width: 80,
        hidden: true,
        retrieve: {
        type: 'Image',
        index: 2,
        width: 200,
        style: {
            cursor: 'pointer'
        }
        },
        create: picResUrlCreateUpdate,
        update: picResUrlCreateUpdate
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 80,
        render: (text, record: any) => <div>{record.status === 1 ? 'online' : 'offline'}</div>,
        filter: {
        type: 'Select',
        options: StatusOptions,
        index: 2
        },
        retrieve: {
        type: 'Text',
        index: 2,
        options: StatusOptions
        },
        create: {
        type: 'Select',
        options: StatusOptions,
        required: true,
        index: 2
        },
        update: true
    },
    {
        title: 'Create Time',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 200,
        filter: {
        type: 'Select',
        options: [
            {
            value: 'ASC',
            label: 'ASC'
            },
            {
            value: 'DESC',
            label: 'DESC'
            }
        ],
        required: false
        },
        render: (text, record: any) => <div>{formatDate(record.createdAt, 'yyyy-MM-dd hh:mm:ss')}</div>
    },
    {
        title: 'Update Time',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 200,
        filter: {
        type: 'Select',
        options: [
            {
            value: 'ASC',
            label: 'ASC'
            },
            {
            value: 'DESC',
            label: 'DESC'
            }
        ],
        required: false
        },
        render: (text, record: any) => <div>{formatDate(record.updatedAt, 'yyyy-MM-dd hh:mm:ss')}</div>
    },
    {
        title: 'Operation',
        key: 'id',
        align: 'center',
        dataIndex: 'id',
        width: 150,
        fixed: 'right',
        render: (text, record: any) => (
        <Space size="middle">
            <Button
            key={1}
            type="primary"
            size="small"
            onClick={() => {
                setItemData(record);
                setUpdateModalVisible(true);
            }}
            >
            Edit
            </Button>
            <Button
            key={2}
            type="primary"
            size="small"
            onClick={() => {
                setItemData(record);
                setRetrieveModalVisible(true);
            }}
            >
            Detail
            </Button>
        </Space>
        )
    }
    ];

    const listColumns = columns.filter((item: any) => !item.hidden);
    const handleCreate = async options => {
    const paramsData = Object.assign({}, itemData, options, {
        country: options.country ? options.country.toString() : options.country,
        image: itemData.image,
        icon: itemData.icon
    });
    // @ts-ignore
    const result = (await request.post(\`/demoList\`, paramsData, { 'X-showMessage': true })) as any;
    if (result.isSuccess) {
        setCreateModalVisible(false);
        fetchDataOrigin({
        pageSize,
        pageIndex,
        ...params
        });
    }
    };

    const handleUpdate = async options => {
    const paramsData = Object.assign({}, itemData, options, {
        country: options.country ? options.country.toString() : options.country,
        image: itemData.image,
        icon: itemData.icon
    });
    // @ts-ignore
    const result = (await request.put(\`/${lowerCaseName}/\$\{itemData.id\}\`, paramsData, { 'X-showMessage': true })) as any;
    if (result.isSuccess) {
        setUpdateModalVisible(false);
        fetchDataOrigin({
        pageSize,
        pageIndex,
        ...params
        });
    }
    };

    return (
    <section className="${lowerCaseName}">
        <Row gutter={24}>
        <Col span={24}>
            <Filter
            columns={columns}
            filterColumnNum={3}
            onChange={(values: any) => {
                setParams(values);
                setPageIndex(1);
                fetchDataOrigin({
                pageSize,
                pageIndex: 1,
                ...values
                });
            }}
            />
        </Col>
        </Row>
        <Divider />
        <div className="operation-bar">
        <Button
            type="primary"
            onClick={() => {
            setItemData({});
            setCreateModalVisible(true);
            }}
        >
            Add
        </Button>
        </div>
        <Table columns={listColumns} dataSource={listData} loading={loading} scroll={{ x: 1042 }} pagination={{ total, current: pageIndex, defaultPageSize: pageSize }} onChange={onTableChange} />
        <RetrieveModal columns={columns} itemData={itemData} visible={retrieveModalVisible} setVisible={setRetrieveModalVisible} />
        <CreateModal columns={columns} itemData={itemData} visible={createModalVisible} setVisible={setCreateModalVisible} onChange={handleCreate} style={{ top: '10px' }} />
        <UpdateModal columns={columns} itemData={itemData} visible={updateModalVisible} setVisible={setUpdateModalVisible} onChange={handleUpdate} style={{ top: '10px' }} />
    </section>
    );
}
        `;

  return { template, dir: `app/web/${name}`, name: `index.ts` };
};
