import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { Field, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { copyToClipboard } from 'common/utils';
import { setNotification } from 'common/notification';

import { AutoComplete } from 'components/UI/Form/AutoComplete/AutoComplete';
import { Button } from 'components/UI/Form/Button/Button';
import { DialogBox } from 'components/UI/DialogBox/DialogBox';
import { Input } from 'components/UI/Form/Input/Input';
import { Loading } from 'components/UI/Layout/Loading/Loading';

import { GET_ASSISTANT, GET_MODELS } from 'graphql/queries/Assistant';
import { DELETE_ASSISTANT, UPDATE_ASSISTANT } from 'graphql/mutations/Assistant';

import CopyIcon from 'assets/images/CopyGreen.svg?react';

import { AssistantOptions } from '../AssistantOptions/AssistantOptions';

import styles from './CreateAssistant.module.css';

interface CreateAssistantProps {
  currentId: string | number | null;
  updateList: boolean;
  setCurrentId: any;
  setUpdateList: any;
}

export const CreateAssistant = ({
  currentId,
  setUpdateList,
  setCurrentId,
  updateList,
}: CreateAssistantProps) => {
  const [assistantId, setAssistantId] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState<any>(null);
  const [instructions, setInstructions] = useState('');
  const [options, setOptions] = useState({ fileSearch: true, temperature: 1 });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const states = {
    name,
    model,
    instructions,
    options,
  };

  let modelOptions = [];

  const { data: modelsList, loading: listLoading } = useQuery(GET_MODELS);
  const [getAssistant, { loading }] = useLazyQuery(GET_ASSISTANT);

  const [updateAssistant, { loading: savingChanges }] = useMutation(UPDATE_ASSISTANT, {
    onCompleted: () => {
      setNotification('Changes saved successfully', 'success');
    },
  });

  const [deleteAssistant, { loading: deletingAssistant }] = useMutation(DELETE_ASSISTANT);

  if (modelsList) {
    modelOptions = modelsList?.listOpenaiModels.map((item: string, index: number) => ({
      id: index.toString(),
      label: item,
    }));
  }

  useEffect(() => {
    if (currentId && modelsList) {
      getAssistant({
        variables: { assistantId: currentId },
        onCompleted: ({ assistant }) => {
          setAssistantId(assistant?.assistant?.assistantId);
          setName(assistant?.assistant?.name || '');
          let modelValue = modelOptions?.find(
            (item: any) => item.label === assistant?.assistant?.model
          );
          setModel(modelValue);
          setInstructions(assistant?.assistant?.instructions || '');
          setOptions({
            ...options,
            temperature: assistant?.assistant?.temperature,
          });
        },
      });
    }
  }, [currentId, modelsList]);

  const handleCreate = () => {
    const {
      instructions: instructionsValue,
      model: modelValue,
      name: nameValue,
      options: optionsValue,
    } = states;

    const payload = {
      instructions: instructionsValue,
      model: modelValue.label,
      name: nameValue,
      temperature: optionsValue?.temperature,
    };

    updateAssistant({
      variables: {
        updateAssistantId: currentId,
        input: payload,
      },
    });
  };

  const formFields: any = [
    {
      component: AutoComplete,
      name: 'model',
      options: modelOptions || [],
      optionLabel: 'label',
      multiple: false,
      label: 'Model',
      helperText: 'Use this to categorize your flows.',
      onChange: (value: any) => setModel(value),
    },
    {
      component: Input,
      name: 'name',
      type: 'text',
      label: 'Name',
      onChange: (value: any) => setName(value),
      helperText: (
        <div className={styles.AssistantId}>
          <span className={styles.HelperText}>Give a recognizable name for your assistant</span>
          <div onClick={() => copyToClipboard(assistantId)}>
            <CopyIcon />
            <span>{assistantId}</span>
          </div>
        </div>
      ),
    },
    {
      component: Input,
      name: 'instructions',
      type: 'text',
      label: 'Instructions',
      rows: 3,
      textArea: true,
      helperText: 'Set the instructions according to your requirements.',
      onChange: (value: any) => setInstructions(value),
    },
    {
      component: AssistantOptions,
      name: 'options',
      options,
      currentId,
      setOptions,
    },
  ];

  const FormSchema = Yup.object().shape({
    name: Yup.string(),
    model: Yup.object().required('Model is required'),
    instructions: Yup.string(),
  });

  const formik = useFormik({
    initialValues: states,
    validationSchema: FormSchema,
    enableReinitialize: true,
    onSubmit: (values, { setErrors }) => {},
  });

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handleDelete = () => {
    deleteAssistant({
      variables: {
        deleteAssistantId: currentId,
      },
      onCompleted: ({ deleteAssistant }) => {
        setShowConfirmation(false);
        setNotification(
          `Assistant ${deleteAssistant.assistant.name} deleted successfully`,
          'success'
        );
        setCurrentId(null);
        setUpdateList(!updateList);
      },
    });
  };

  let dialog;
  if (showConfirmation) {
    dialog = (
      <DialogBox
        title={`Are you sure you want to delete the assistant ${name}?`}
        handleCancel={handleClose}
        colorOk="warning"
        alignButtons="center"
        handleOk={handleDelete}
        buttonOkLoading={deletingAssistant}
        disableOk={deletingAssistant}
      >
        <div className={styles.DialogContent}>You won't be able to use this assistant.</div>
      </DialogBox>
    );
  }

  if (loading || listLoading) {
    return <Loading />;
  }
  return (
    <FormikProvider value={formik}>
      <div className={styles.FormContainer}>
        <form className={styles.Form} onSubmit={formik.handleSubmit} data-testid="formLayout">
          <div className={styles.FormFields}>
            {formFields.map((field: any) => (
              <div className={styles.FormSection} key={field.name}>
                <Typography className={styles.Label} variant="h5">
                  {field.label}
                </Typography>

                <Field key={field.name} {...field} />
              </div>
            ))}
          </div>
          <div className={styles.Buttons}>
            <Button loading={savingChanges} onClick={handleCreate} variant="contained">
              Save Changes
            </Button>
            <Button onClick={() => setShowConfirmation(true)} variant="outlined" color="error">
              Remove
            </Button>
          </div>
        </form>
        {dialog}
      </div>
    </FormikProvider>
  );
};
