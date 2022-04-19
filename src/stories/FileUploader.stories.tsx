import { FileUploader } from '@/components/uploaders/fileUploader';
import React from 'react';

export default {
  title: 'Molecules/File Uploader',
  argTypes: {
    handleCancelUpload: {
      action: 'Clicked delete'
    }
  }
};

const Template = (args) => <FileUploader {...args} />;

export const Default = Template.bind({});
Default.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 0
};

export const Loading = Template.bind({});
Loading.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 25
};

export const Complete = Template.bind({});
Complete.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 100
};
