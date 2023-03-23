import "./index.scss";
import {
	TextControl,
	Flex,
	FlexBlock,
	Button,
	FlexItem,
	Icon,
} from "@wordpress/components";

(function () {
	let locked = false;

	wp.data.subscribe(() => {
		const results = wp.data
			.select("core/block-editor")
			.getBlocks()
			.filter((block) => {
				return (
					block.name == "ourplugin/are-you-paying-attention" &&
					block.attributes.correctAnswer == undefined
				);
			});

		if (results.length && locked == false) {
			locked = true;
			wp.data.dispatch("core/editor").lockPostSaving("noanswer");
		}

		if (!results.length && locked) {
			locked = false;
			wp.data.dispatch("core/editor").unlockPostSaving("noanswer");
		}
	});
})();

wp.blocks.registerBlockType("ourplugin/are-you-paying-attention", {
	title: "Are You Paying Attention?",
	icon: "smiley",
	category: "common",
	attributes: {
		question: { type: "string" },
		answers: { type: "array", default: [""] },
		correctAnswer: { type: "number", default: undefined },
	},
	edit: EditComponent,
	save: function () {
		return null;
	},
});

function EditComponent(props) {
	function updateQuestion(value) {
		props.setAttributes({ question: value });
	}

	function deleteAnswer(indexToDelete) {
		const newAnswers = props.attributes.answers.filter(function (x, index) {
			return index != indexToDelete;
		});
		props.setAttributes({ answers: newAnswers });

		if (indexToDelete == props.attributes.correctAnswer) {
			props.setAttributes({ correctAnswer: undefined });
		}
	}

	function markAsCorrect(index) {
		props.setAttributes({ correctAnswer: index });
	}

	return (
		<div className='paying-attention-edit-block'>
			<TextControl
				label='Question:'
				value={props.attributes.question}
				onChange={updateQuestion}
				style={{ fontSize: "20px" }}
			/>
			<p style={{ fontSize: "13px", margin: "20px 0 8px 0" }}>Answers:</p>
			{props.attributes.answers.map((answer, index) => {
				return (
					<Flex>
						<FlexBlock>
							<TextControl
								value={answer}
								onChange={(newValue) => {
									const newAnswers = props.attributes.answers.concat([]);
									newAnswers[index] = newValue;
									props.setAttributes({ answers: newAnswers });
								}}
								autoFocus={answer == undefined}
							/>
						</FlexBlock>
						<FlexItem>
							<Button onClick={() => markAsCorrect(index)}>
								<Icon
									icon={
										props.attributes.correctAnswer == index
											? "star-filled"
											: "star-empty"
									}
									className='mark-as-correct'
								/>
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								isLink
								className='attention-delete'
								onClick={() => deleteAnswer(index)}
							>
								Delete
							</Button>
						</FlexItem>
					</Flex>
				);
			})}
			<Button
				isPrimary
				onClick={() => {
					props.setAttributes({
						answers: props.attributes.answers.concat([undefined]),
					});
				}}
			>
				Add another answer
			</Button>
		</div>
	);
}
