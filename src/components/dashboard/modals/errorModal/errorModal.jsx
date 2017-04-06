const React = require('react');
const Modal = require('react-modal');
const modalStore = require('../../../../stores/modal');
const { hideErrorModal } = require('../../../../actions/modal');

const { PureComponent } = React;

class ErrorModal extends PureComponent {
  constructor() {
    super();

    this.onStoreChange = this.onStoreChange.bind(this);

    this.state = {
      isOpen: false,
      content: null
    };
  }

  componentDidMount() {
    modalStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    modalStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    debugger;
    const { isOpen, content } = modalStore.getErrorModalData();
    this.setState({
      isOpen,
      content
    });
  }

  render() {
    const { isOpen, content } = this.state;
    debugger;
    const messages = content && content.split(/\n/g).map(message => <p>{message}</p>)

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={hideErrorModal}
        contentLabel="Error modal"
      >
        {messages}
      </Modal>
    );
  }
}

module.exports = ErrorModal;
