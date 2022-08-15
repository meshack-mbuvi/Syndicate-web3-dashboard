import { PillButton } from '@/components/pillButtons';
import {
  FileUploader,
  UploaderProgressType
} from '@/components/uploaders/fileUploader';
import React from 'react';

export default {
  title: '3. Molecules/File Uploader',
  argTypes: {
    handleCancelUpload: {
      action: 'Clicked delete'
    },
    progressDisplayType: {
      options: [UploaderProgressType.LOADING_BAR, UploaderProgressType.SPINNER],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => <FileUploader {...args} />;

export const Default = Template.bind({});
Default.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 0,
  heightClass: 'h-32',
  promptTitle: 'Upload artwork',
  promptSubtitle: 'PNG or MP4 allowed'
};

export const AddOn = Template.bind({});
AddOn.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 0,
  promptTitle: 'Upload artwork',
  promptSubtitle: 'PNG or MP4 allowed',
  addOn: (
    <PillButton
      onClick={() => {
        alert('Generate art!');
      }}
    >
      Generate for me
    </PillButton>
  )
};

export const LoadingBar = Template.bind({});
LoadingBar.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 25,
  heightClass: 'h-32',
  promptTitle: 'Upload artwork',
  promptSubtitle: 'PNG or MP4 allowed'
};

export const Spinner = Template.bind({});
Spinner.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 25,
  heightClass: 'h-32',
  promptTitle: 'Upload artwork',
  promptSubtitle: 'PNG or MP4 allowed',
  progressDisplayType: UploaderProgressType.SPINNER
};

export const Complete = Template.bind({});
Complete.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  progressPercent: 100,
  heightClass: 'h-32',
  promptTitle: 'Upload artwork',
  promptSubtitle: 'PNG or MP4 allowed'
};

export const Error = Template.bind({});
Error.args = {
  fileName: 'file.csv',
  successText: '32 addresses',
  errorText: 'File exceeds size limit of XXX MB',
  progressPercent: 10,
  heightClass: 'h-32',
  promptTitle: 'Upload artwork',
  promptSubtitle: 'PNG or MP4 allowed'
};
