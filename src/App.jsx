import React, { useState } from 'react';
import { Button, Modal, Input, Select, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const schemaOptions = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
];

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSegmentName('');
    setSelectedSchemas([]);
    setAvailableSchemas(schemaOptions);
    setSelectedSchema(null);
  };

  const handleAddNewSchema = () => {
    if (selectedSchema) {
      const selectedOption = availableSchemas.find(option => option.value === selectedSchema);
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      const newAvailableSchemas = availableSchemas.filter(option => option.value !== selectedSchema);
      setAvailableSchemas(newAvailableSchemas);
      setSelectedSchema(null); 
    } else {
      message.warning('Please select a schema first.');
    }
  };

  const handleSaveSegment =async () => {
    if (!segmentName) {
      message.error('Please enter a segment name.');
      return;
    }

    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
    };

    try {
      const response = await axios.post('https://webhook.site/791bea10-eea6-4782-bfec-fe228225079a', segmentData);
      message.success('Segment saved successfully.');
      console.log('Server Response:', response.data);
      handleCancel();
    } catch (error) {
      message.error('Failed to save the segment.');
      console.error('Error saving the segment:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={showModal}>
        Save Segment
      </Button>

      <Modal
        title="Save Segment"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSaveSegment}
        okText="Save Segment"
      >
        <Form layout="vertical">
          <Form.Item label="Segment Name">
            <Input
              value={segmentName}
              onChange={e => setSegmentName(e.target.value)}
              placeholder="Enter segment name"
            />
          </Form.Item>

          <div style={{ padding: '10px', backgroundColor: '#e6f7ff', marginBottom: '10px' }}>
            {selectedSchemas.map((schema, index) => (
              <Select
                key={index}
                style={{ width: '100%', marginBottom: '10px' }}
                value={schema.value}
                onChange={(value) => {
                  const updatedSchema = schemaOptions.find(option => option.value === value);
                  const updatedSchemas = selectedSchemas.map(s => (s.value === schema.value ? updatedSchema : s));
                  setSelectedSchemas(updatedSchemas);
                  const updatedAvailableSchemas = schemaOptions.filter(option => !updatedSchemas.find(s => s.value === option.value));
                  setAvailableSchemas(updatedAvailableSchemas);
                }}
              >
                {availableSchemas.concat(schema).map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            ))}
          </div>

          <Form.Item label="Add schema to segment">
            <Select
              value={selectedSchema}
              onChange={value => setSelectedSchema(value)}
              placeholder="Select a schema"
              style={{ width: '100%' }}
            >
              {availableSchemas.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={handleAddNewSchema}
          >
            Add new schema
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
