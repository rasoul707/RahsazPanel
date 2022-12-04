import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";
// Components
import {
    NormalInput,
    // NumberInput,
    AsyncSelectInput,
    TextareaInput,
    FileInput,
    SelectInput
} from "Components/Inputs";
// Services
import { getCategoriesOfChildrenApi, addCategoryApi, editCategoryApi } from "Services";
const useStyles = makeStyles(theme => ({ wrapper: {} }));
export default function AddEditCategoryModal({
    title,
    visible,
    onCancel,
    setReload,
    parentColumnName,
    selectedChildren
}) {
    const classes = useStyles();
    const methods = useForm();
    const isEdit = !!visible.id;
    const [loading, setLoading] = useState(false);
    const [icon, setIcon] = useState(null);
    // console.log('icons',icon);
    console.log("visible", visible);
    useEffect(() => {
        if (isEdit) {
            setIcon(
                visible
                    ?.image
            );
            const defaultData = {
                ...visible,
                parent_category_item_id: {
                    label: visible
                        ?.parent
                        ?.name,
                    value: visible
                        ?.parent
                        ?.id
                }
            };
            methods.reset(defaultData);
        }
    }, [visible]);
    const onSubmit = async data => {
        setLoading(true);
        const api = isEdit
            ? editCategoryApi
            : addCategoryApi;
        const body = isEdit
            ? {
                id: visible.id,
                body: {
                    ...data,
                    // icon: icon?.path, icon: icon?.path,
                    category_id: selectedChildren
                        ?.id
                }
            }
            : {
                ...data,
                // icon: icon?.path,
                category_id: selectedChildren
                    ?.id
            };
        console.log("body", body);
        await api(body)
            .then(() => {
                setLoading(false);
                setReload(prev => !prev);
                onCancel();
            })
            .catch(() => {
                setLoading(false);
            });
    };
    return (
        <Modal
            title={title}
            visible={!!visible}
            onCancel={onCancel}
            onOk={methods.handleSubmit(onSubmit)}
            cancelText="لغو"
            okText="ذخیره تغییرات"
            okButtonProps={{
                style: {
                    background: "#FF921F",
                    color: "#ffffff",
                    border: "none"
                }
            }}>
            <Spin spinning={loading}>
                <FormProvider {...methods}>
                    <form
                        style={{
                            // height: "750px"
                        }}>
                        <NormalInput
                            name="name"
                            label="نام دسته بندی"
                            placeholder="نام را وارد کنید"
                        />

                        {/* <NormalInput
                            name="order"
                            label="الویت"
                            placeholder="الویت را وارد کنید"
                            type="number"
                            defaultData={visible
                                ?.order} />
                        <SelectInput label="آیکون" placeholder="آیکون را انتخاب کنید"
                            // defaultValue={{
                            //   label: visible?.icon,
                            //   value: visible?.icon,
                            // }}
                            options={[
                                {
                                    value: '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIc' +
                                        'on-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 ' +
                                        '24 24" data-testid="AccessAlarmIcon" tabindex="-1" title="AccessAlarm"><path d' +
                                        '="m22 5.72-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39 6.6 1.86 2 5.71l1.29' +
                                        ' 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9' +
                                        ' 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-' +
                                        '7 7 3.13 7 7-3.13 7-7 7z"></path></svg>',
                                    label: 'Access Alarm '
                                }, {
                                    value: '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIc' +
                                        'on-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 ' +
                                        '24 24" data-testid="AcUnitIcon" tabindex="-1" title="AcUnit"><path d="M22 11h-' +
                                        '4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76' +
                                        ' 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 ' +
                                        '1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 ' +
                                        '15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"></path></svg>',
                                    label: 'AcUnit'
                                }, {
                                    value: '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIc' +
                                        'on-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 ' +
                                        '24 24" data-testid="AccessAlarmsIcon" tabindex="-1" title="AccessAlarms"><path' +
                                        ' d="m22 5.7-4.6-3.9-1.3 1.5 4.6 3.9L22 5.7zM7.9 3.4 6.6 1.9 2 5.7l1.3 1.5 4.6-' +
                                        '3.8zM12.5 8H11v6l4.7 2.9.8-1.2-4-2.4V8zM12 4c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-' +
                                        '9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"></path></svg>',
                                    label: 'AccessAlarms'
                                }
                            ]} name="icon" />
                             */}
                        <NormalInput
                            name="password"
                            type="password"
                            label="پسورد"
                            placeholder="پسورد را وارد کنید"
                            autoComplete="new-password"
                        />
                        {/* <div className="form-floating">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password" />
                            <label htmlFor="floatingPassword">Password</label>
                        </div> */}
                        {
                            parentColumnName && (
                                <AsyncSelectInput
                                    name="parent_category_item_id"
                                    label={`انتخاب ${parentColumnName}`}
                                    placeholder={`جستجو برای ${parentColumnName}`}
                                    shouldCheckValidDefault="shouldCheckValidDefault"
                                    isClearable="isClearable"
                                    inModal="inModal"
                                    defaultValue={{
                                        label: visible
                                            ?.parent
                                            ?.name,
                                        value: visible
                                            ?.parent
                                            ?.id
                                    }}
                                    isMulti={false}
                                    api={getCategoriesOfChildrenApi}
                                    exteraParams={{
                                        id: Number(selectedChildren.id) - 1
                                    }} />
                            )
                        }
                        <TextareaInput
                            name="description"
                            label="توضیحات دسته بندی"
                            placeholder="توضیحات را وارد کنید" /> {/* <FileInput
              label="آیکون"
              setFile={setIcon}
              defaultValue={icon?.path}
            /> */
                        }
                    </form>
                </FormProvider>
            </Spin>
        </Modal>
    );
}
