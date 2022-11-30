import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Spin, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";

// Components
import { NormalInput, } from "Components/Inputs";
import { Grid } from "@material-ui/core";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ReactComponent as DeleteIcon } from "Assets/img/icons/delete-red.svg";
import { Button, RadioButton } from "Components/Button";


// Services
import {
  getFooterSettingByIDApi,
  createFooterSettingItemApi,
  deleteFooterSettingItemApi,
  updateFooterSettingApi,


} from "Services";

const useStyles = makeStyles(theme => ({
  wrapper: {},
  ltr_input: {
    direction: "rtl",
  },
  iconButton: {
    background: "#FFFFFF",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    cursor: "pointer",
    marginTop: 10,
  }
}));

export default function FooterMenuItemsModal({
  title,
  visible,
  onCancel,
  setReload,
  menuID,
}) {
  const classes = useStyles();
  const methods = useForm();

  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState(null)
  const [menuItems, setMenuItems] = useState(null)

  const onSubmit = async () => {
    setLoading(true);

    const body = { ...menuData, items: menuItems };
    await updateFooterSettingApi(body.id, body)
      .then(() => {
        setLoading(false);
        setReload(prev => !prev);
        onCancel();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onChangeFields = (field) => (value) => {
    if (field.includes('items')) {
      const f = field.split(".")
      let g = [...menuItems]
      g[f[1]] = { ...menuItems[f[1]], [f[2]]: value }
      setMenuItems([...g])
    }
    else {
      setMenuData({ ...menuData, [field]: value })
    }
  }

  const getDate = async () => {
    setLoading(true);

    const data = await getFooterSettingByIDApi(menuID);
    setMenuItems(data.items.map((v, i) => ({ ...v, id: v.id.toString() })))
    delete data.items
    setMenuData(data);
    setLoading(false);
  };

  const addNewItem = async () => {
    setLoading(true);
    await createFooterSettingItemApi({ menu_id: menuID, title: "منوی جدید" });
    await getDate()
    setReload(prev => !prev)
  }

  const deleteFooterSettingItem = async (id) => {
    setLoading(true);
    await deleteFooterSettingItemApi(id)
      .then(async () => {
        await getDate()
        setLoading(false)
        setReload(prev => !prev)
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // set default values
  useEffect(() => {
    if (visible) {
      getDate()
      // methods.reset(visible);
    }
  }, [visible]);


  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };


  const getItemsBoxItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: "16px",
    margin: `0 0 8px 0`,
    // position: "relative",
    // change background colour if dragging
    background: isDragging ? "#cececf" : "#F4F4F5",
    boxShadow: isDragging ? "#00000038 2px 3px 10px 0px" : "none",
    borderRadius: '10px',
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getItemsListStyle = isDraggingOver => ({})

  const onDragEndItems = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const initial = result.source.index
    const final = result.destination.index


    const _items = reorder(menuItems, initial, final)
    const data = _items.map((v, i) => ({ ...v, priority: i + 1 }))

    setMenuItems([...data])
  }



  return (
    <Modal
      title={title}
      visible={!!visible}
      onOk={onSubmit}
      onCancel={onCancel}
      cancelText="لغو"
      okText={"ذخیره تغییرات"}
      okButtonProps={{
        style: { background: "#F6891F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <NormalInput
          value={menuData?.title}
          onChange={onChangeFields('title')}
          label="عنوان"
          placeholder="عنوان را وارد کنید"
          withoutControl
        />
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <NormalInput
              value={menuData?.xs}
              onChange={onChangeFields('xs')}
              label="xs"
              withoutControl
              classes={{ input: classes.ltr_input }}
            />
          </Grid>
          <Grid item xs={3}>
            <NormalInput
              value={menuData?.sm}
              onChange={onChangeFields('sm')}
              label="sm"
              withoutControl
              classes={{ input: classes.ltr_input }}
            />
          </Grid>
          <Grid item xs={3}>
            <NormalInput
              value={menuData?.md}
              onChange={onChangeFields('md')}
              label="md"
              withoutControl
              classes={{ input: classes.ltr_input }}
            />
          </Grid>
          <Grid item xs={3}>
            <NormalInput
              value={menuData?.lg}
              onChange={onChangeFields('lg')}
              label="lg"
              withoutControl
              classes={{ input: classes.ltr_input }}
            />
          </Grid>
        </Grid>

        <Button
          disabled={loading}
          onClick={() => addNewItem()}
        >
          افزودن آیتم
        </Button>
        <hr />

        {menuItems?.length
          ?
          <DragDropContext onDragEnd={(res) => onDragEndItems(res)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getItemsListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {menuItems?.map((v, i) => (
                    <Draggable key={v.id} draggableId={v.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemsBoxItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                              <NormalInput
                                value={v.title}
                                onChange={onChangeFields(`items.${i}.title`)}
                                label="عنوان"
                                withoutControl
                              />
                            </Grid>
                            <Grid item xs >
                              <NormalInput
                                value={v.link}
                                onChange={onChangeFields(`items.${i}.link`)}
                                label="لینک"
                                classes={{ input: classes.ltr_input }}
                                withoutControl
                              />
                            </Grid>
                            <Grid item xs="auto">
                              <button
                                type="button"
                                onClick={() => deleteFooterSettingItem(v?.id)}
                                className={classes.iconButton}
                              >
                                <DeleteIcon />
                              </button>
                            </Grid>
                          </Grid>

                        </div>
                      )}
                    </Draggable>
                  )
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          :
          <strong className="no-data-msg">
            آیتمی یافت نشد
          </strong>
        }



      </Spin>
    </Modal>
  );
}
