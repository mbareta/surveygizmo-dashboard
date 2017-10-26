/* eslint-disable */

const React = require('react');
const ReactPaginate = require('react-paginate');
const FormResponsesTable = require('./formResponsesTable.jsx');
const FormResponse = require('./formResponse/formResponse.jsx');
const FormResponseDetails = require('./formResponseDetails/formResponseDetails.jsx');
const ApproveModal = require('../modals/approveModal/approveModal.jsx');
const RejectModal = require('../modals/rejectModal/rejectModal.jsx');
const responsesStore = require('../../../stores/responses');
const responseActions = require('../../../actions/response');
const { comparators, withAscending } = require('../../../utils/responses');

class FormResponses extends React.PureComponent {
  constructor() {
    super();

    this.onStoreChange = this.onStoreChange.bind(this);
    this.viewResponse = this.viewResponse.bind(this);
    this.showApproveModal = this.showApproveModal.bind(this);
    this.showRejectModal = this.showRejectModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.search = this.search.bind(this);
    this.filter = this.filter.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onSort = this.onSort.bind(this);

    this.state = {
      search: '',
      filter: '',
      responses: [],
      approveResponse: null,
      rejectResponse: null,
      totalCount: 0,
      pageCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      unprocessedCount: 0,
      isPrinting: false
    };
  }

  handlePageClick({ selected }) {
    this.setCurrentPageIndex(selected);

    const page = selected + 1;
    responseActions.loadResponses(page);
  }

  viewResponse(viewResponse) {
    this.setState({ viewResponse });
  }

  showApproveModal(approveResponse) {
    this.setState({ approveResponse });
  }

  showRejectModal(rejectResponse) {
    this.setState({ rejectResponse });
  }

  closeModal() {
    this.setState({
      rejectResponse: null,
      approveResponse: null
    });
  }

  search(event) {
    this.setState({ search: event.target.value });
  }

  filter(event) {
    this.setState({ filter: event.target.value });
  }

  printResponses() {
    /**
     * Chrome doesn't have onafterprint natively so we're manually switching state.
     * With callback and timeout we're forcing JS to run this code synchronously.
     */
    this.setState({ isPrinting: true }, () => {
      window.print();
      setTimeout(() => this.setState({ isPrinting: false }), 0);
    });
  }

  onStoreChange() {
    const currentPage = this.getCurrentPage();

    this.setState({
      totalCount: responsesStore.getTotalCount(),
      pageCount: responsesStore.getPageCount(),
      approvedCount: responsesStore.getApprovedCount(),
      rejectedCount: responsesStore.getRejectedCount(),
      unprocessedCount: responsesStore.getUnprocessedCount(),
      responses: responsesStore
        .getResponses(currentPage)
        .sort(withAscending(comparators.submittedAt))
    });
  }

  componentDidMount() {
    const currentPage = this.getCurrentPage();

    responsesStore.addChangeListener(this.onStoreChange);
    responseActions.loadResponses(currentPage);
  }

  componentWillUnmount() {
    responsesStore.removeChangeListener(this.onStoreChange);
  }

  getCurrentPageIndex() {
    const currentPageIndex = localStorage.getItem('currentPageIndex');

    if (!currentPageIndex) {
      localStorage.setItem('currentPageIndex', 0);
      return 0;
    }

    return parseInt(currentPageIndex, 10);
  }

  setCurrentPageIndex(index) {
    localStorage.setItem('currentPageIndex', index);
  }

  getCurrentPage() {
    return this.getCurrentPageIndex() + 1;
  }

  onSort(comparator) {
    const responses = [...this.state.responses];
    responses.sort(comparator);

    this.setState({ responses });
  }

  render() {
    const {
      responses,
      comparator,
      sortAscending,
      viewResponse,
      approveResponse,
      rejectResponse,
      search,
      filter,
      isPrinting
    } = this.state;
    const currentPageIndex = this.getCurrentPageIndex();
    let filteredResponses = [];

    if (search) {
      filteredResponses = responses.filter(
        r =>
          r.questions &&
          (r.questions['Submitter First Name']
            .toLowerCase()
            .indexOf(search.toLowerCase()) >= 0 ||
            r.questions['Submitter Last Name']
              .toLowerCase()
              .indexOf(search.toLowerCase()) >= 0 ||
            r.questions['Submitter Email']
              .toLowerCase()
              .indexOf(search.toLowerCase()) >= 0 ||
            r.questions['Organization Name']
              .toLowerCase()
              .indexOf(search.toLowerCase()) >= 0)
      );
    } else {
      filteredResponses = responses;
    }

    if (filter === 'pending') {
      filteredResponses = filteredResponses.filter(r => !r.status);
    } else if (filter) {
      filteredResponses = filteredResponses.filter(
        r => r.status && r.status[filter]
      );
    }

    return (
      <div>
        <button
          className="printButton no-print"
          onClick={() => this.printResponses()}
        >
          Print
        </button>
        <div className="stats no-print">
          <h2>Affiliate Signup Responses ({this.state.totalCount})</h2>
          <span>
            <h1>{this.state.unprocessedCount}</h1>
            <h3>Unprocessed responses</h3>
          </span>
          <span>
            <h1>{this.state.approvedCount}</h1>
            <h3>Approved responses</h3>
          </span>
          <span>
            <h1>{this.state.rejectedCount}</h1>
            <h3>Rejected responses</h3>
          </span>
          <div>
            <input type="search" onChange={this.search} placeholder="Search" />
            <select onChange={this.filter} autoComplete="off" defaultValue="">
              <option value="">Filter By Status</option>
              <option value="pending">Pending</option>
              <option value="sentPasswordReset">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <b style={{ textAlign: 'left' }}>
              {filteredResponses.length} results
            </b>
          </div>
        </div>
        <FormResponsesTable
          isPrinting={isPrinting}
          onSort={comparator => this.onSort(comparator)}
          responses={filteredResponses}
        />
        <div className="pagination no-print">
          <ReactPaginate
            pageCount={this.state.pageCount}
            onPageChange={this.handlePageClick}
            activeClassName="active"
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            initialPage={currentPageIndex}
          />
        </div>

        <FormResponseDetails
          showApproveModal={this.showApproveModal}
          showRejectModal={this.showRejectModal}
        />

        <ApproveModal response={approveResponse} close={this.closeModal} />
        <RejectModal response={rejectResponse} close={this.closeModal} />
      </div>
    );
  }
}

module.exports = FormResponses;
