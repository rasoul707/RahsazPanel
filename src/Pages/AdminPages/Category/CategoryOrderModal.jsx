import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Spin, Modal } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Assets
import { ReactComponent as MoveIcon } from "Assets/img/icons/move.svg";

// Services
import { getCategoryItemsApi, reorderCategoriesApi } from "Services";

const useStyles = makeStyles(theme => ({
  item: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

// dragabel styles
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,
  padding: "14px 20px",
  // change background colour if dragging
  background: isDragging ? "#fafafa" : "transparent",
  borderRadius: "8px",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  background: "transparent",
});

// handle image drag and drop for order
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function ViewSolicitorModal({
  title,
  visible,
  onCancel,
  setReload,
}) {
  const classes = useStyles();

  const [data, setData] = useState([]);
  console.log("data: ", data);
  const [loading, setLoading] = useState(false);

  const initialPage = async () => {
    setLoading(true);
    const data = await getCategoryItemsApi({
      id: 4,
      offset: 0,
    });
    setData(
      data.items.sort((a, b) =>
        a.order > b.order ? 1 : b.order > a.order ? -1 : 0,
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    // get data for edit page
    initialPage();
  }, []);

  const handleDragImage = result => {
    setData(reorder(data, result.source.index, result.destination.index));
  };

  // handle submit
  const handleSubmit = async () => {
    const body = {
      items: data.map((item, index) => ({
        id: item.id,
        order: index + 1,
      })),
    };

    setLoading(true);
    await reorderCategoriesApi(body);
    setLoading(false);
    onCancel();
    setReload(prev => !prev);
  };

  return (
    <Modal
      title={title}
      visible={!!visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      cancelText="لغو"
      okText="ذخیره تغییرات"
      okButtonProps={{
        style: { background: "#FF921F", color: "#ffffff", border: "none" },
      }}
    >
      <Spin spinning={loading}>
        <DragDropContext onDragEnd={handleDragImage}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {data?.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={`${item.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                        className={classes.item}
                      >
                        <span>{item.name}</span>
                        <MoveIcon />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Spin>
    </Modal>
  );
}
