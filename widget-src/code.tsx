const { widget } = figma;
const { AutoLayout, Ellipse, Frame, Image, Rectangle, SVG, Text, useSyncedState, usePropertyMenu, useWidgetId, waitForTask, useEffect} = widget;

function Widget() {
  const[checked, setChecked] = useSyncedState("checked", false)
  const[question, setQuestion] = useSyncedState("question", "Yes or no?")

  usePropertyMenu(
    [
      {
        tooltip: 'Edit',
        propertyName: 'edit',
        itemType: 'action',
      },
    ],
    (e) => {
      console.log(e.propertyName)
      waitForTask(new Promise(resolve => {
        figma.showUI(__html__, { visible: true, width: 400, height: 100 })
        figma.ui.postMessage({ type: "question", message: question})
        figma.ui.onmessage = async (msg) => {
          if (msg.question) {
            setQuestion(msg.question)
            // Resolve the task since we are done!
            resolve(null)
          }
        }
      }))
    },
  )

  async function record(checked: boolean, username: string, fileID: string|undefined) {
    console.log("record: " + checked)

    let answerData = {question: question, checked: checked, username: username, fileID: fileID}

    waitForTask(new Promise(resolve => {
      figma.showUI(__html__, { visible: false })
      figma.ui.postMessage({ type: "answer", answerData: JSON.stringify(answerData)})
      figma.ui.onmessage = async (msg) => {
        if (msg.type == 'notify'){
          figma.notify(msg.msg, {timeout: 4000})
        } else if (msg.type == "result") {
          resolve(null)
        }
      }
    }))
  }

  return (
    
    <Frame
      name="Checkbox"
      cornerRadius={4}
      overflow="visible"
      width={16}
      height={20}
      onClick={async ()=>{
        //TODO need to upate fileKey -> fileURL (or ID?)
        await record(!checked,figma.currentUser!.name, figma.fileKey)
        setChecked(!checked)
      }}
    >
        <Rectangle
          hidden={!checked}
          name="Container"
          x={{
            type: "center",
            offset: 0,
          }}
          y={{
            type: "center",
            offset: 0,
          }}
          fill="#1F73B7"
          cornerRadius={4}
          strokeWidth={0}
          strokeAlign="center"
          width={16}
          height={16}
          hoverStyle={{
            fill: "#144A75"
          }} />
        <SVG
          hidden={!checked}
          name="Check"
          x={{
            type: "center",
            offset: 0,
          }}
          y={{
            type: "center",
            offset: 0,
          }}
          height={6}
          width={8}
          src="<svg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M3 3.58579L6.29289 0.292893C6.68342 -0.0976311 7.31658 -0.0976311 7.70711 0.292893C8.09763 0.683418 8.09763 1.31658 7.70711 1.70711L3.70711 5.70711C3.31658 6.09763 2.68342 6.09763 2.29289 5.70711L0.292893 3.70711C-0.0976311 3.31658 -0.0976311 2.68342 0.292893 2.29289C0.683418 1.90237 1.31658 1.90237 1.70711 2.29289L3 3.58579Z' fill='white'/></svg>" />
        <Rectangle
          name="Container uc"
          hidden={checked}
          x={{
            type: "center",
            offset: 0,
          }}
          y={{
            type: "center",
            offset: 0,
          }}
          fill="#FFF"
          stroke="#D8DCDE"
          cornerRadius={4}
          width={16}
          height={16}
          hoverStyle={{
            fill: "#DDEAF4",
            stroke: "#1F73B7"
          }} />
      </Frame>
    // <AutoLayout
    //   direction="horizontal"
    //   horizontalAlignItems="center"
    //   verticalAlignItems="center"
    //   height="hug-contents"
    //   padding={8}
    //   fill="#FFFFFF"
    //   cornerRadius={8}
    //   spacing={12}
    //   onClick={async () => {
    //     await new Promise((resolve) => {
    //       figma.showUI(__html__);
    //       figma.ui.on("message", (msg) => {
    //         if (msg === "hello") {
    //           figma.notify("Hello Widgets");
    //         }
    //         if (msg === "close") {
    //           figma.closePlugin();
    //         }
    //       });
    //     });
    //   }}
    // >
    //   <Text fontSize={32} horizontalAlignText="center">
    //     Click Me
    //   </Text>
    // </AutoLayout>
  );
}
widget.register(Widget);

