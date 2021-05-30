## `Syndicate`





### `onlyManager(address syndicateAddress)`

Only proceed if the msg.sender is the current manager


"A" refers to "ERR_SENDER_NOT_CURRENT_MNGR"

### `onlyNotManager(address syndicateAddress)`

Only proceed if the msg.sender is not the current manager


"B" refers to "ERR_MNGR_CANT_BE_MEMBR"

### `onlyBeforeDateClose(address syndicateAddress)`

Only proceed if the Syndicate is allowing deposits



### `onlyOpen(address syndicateAddress)`

Only proceed if the Syndicate is not closed



### `onlyClosed(address syndicateAddress)`

Only proceed if the Syndicate is closed



### `onlyAllowlistEnabled(address syndicateAddress)`

Only proceed if the allowlist is enabled


"E" refers to "ERR_ALLOWLIST_NOT_IN_USE"

### `onlyAllowlistDisabled(address syndicateAddress)`

Only proceed if the allowlist is disabled


"F" refers to "ERR_ALLOWLIST_IN_USE"

### `onlyModifiable(address syndicateAddress)`

Only proceed if the Syndicate manager is allowed to modify
deposits and claimed distributions for members


"G" refers to "ERR_ALLOWLIST_IN_USE"


### `constructor()` (public)
Used to initialize the Syndicate contract.

### `managerCreateSyndicate(uint256 managerManagementFeeBasisPoints, uint256 managerPerformanceFeeBasisPoints, uint256 syndicateProfitShareBasisPoints, uint256 numMembersMax, address depositERC20Address, uint256 depositMinMember, uint256 depositMaxMember, uint256 depositMaxTotal, uint256 dateClose, bool allowlistEnabled, bool modifiable)` (public)
Used to create a Syndicate with the address of `msg.sender` and
initialize `msg.sender` as the Syndicate manager.
The `msg.sender` address calling `managerCreateSyndicate()`
becomes permanently associated with the Syndicate. Transferring
management of the Syndicate later will change the `managerCurrent` and
the address at which deposits are received, but will NOT change the
`syndicateAddress`, which permanently identifies the fund.
Syndicate does **not** support tokens that rebalance (e.g.
Ampleforth). This is because Syndicate requires that the deposit token's
units are constant.
For tokens that take fees, Syndicate uses the after-fee amounts
for recording deposits and the before-fee amounts for recording
withdrawals.

**managerManagementFeeBasisPoints**: The management fee in basis
points. A standard structure would be a 2% management fee (200 basis
points). This is displayed in the UI as "Expected Annual Operating Fees"
on the Create Syndicate page.

**managerPerformanceFeeBasisPoints**: The performance fee in basis
points. A standard structure would be a 20% performance fee (2000 basis
points). This is displayed in the UI as "Profit Share to Syndicate Lead"
on the Create Syndicate page.

**syndicateProfitShareBasisPoints**: The profit share that is sent to
the Syndicate treasury. All fees are entered in basis points, or
fractional units of the BASIS_POINTS_DENOMINATOR (set to 10000). For
example, the minimum profit share of 0.50% should be passed in as 50
basis points (since it is 0.50% * 10000). This means that the max
precision is 0.01% (1 basis point).

**numMembersMax**: The max number of members that the Syndicate can
accept as depositors

**depositERC20Address**: The address of the ERC20 used for
deposits (e.g. DAI or USDC's contract addresses) and withdrawals.
Stablecoins are strongly recommended, especially for funds that are open
for an extended period of time. (Otherwise one member could deposit 1
token when it is priced at $100 and another member could deposit 1
token when it is priced at $200, but their percent ownership of the
fund would be the same. Stablecoins prevent this because their value is
consistent.)

**depositMinMember**: The min deposit per member wallet address.

**depositMaxMember**: The max deposit per member wallet address.

**depositMaxTotal**: The max deposit amount for the fund/Syndicate.

**dateClose**: The date that the Syndicate will automatically close in
UNIX time, in seconds.

**allowlistEnabled**: True if the Syndicate ONLY allows deposits
from allowed addresses. False if any (accredited) member can deposit.
Even if this is false, the manager can always reject a contribution
before a Syndicate closes with `rejectDepositFormember()`.

**modifiable**: True if a manager can manually modify members'
deposit and distribution amounts. False if these values can only be
altered by the contract deposit and withdrawal functions.
A manager may wish to manually modify these values to reconcile
off-chain agreements (e.g. advisory shares, which do not have a deposit
associated with them) or to correct for user error (for example, a user
sends their deposit to the manager's wallet directly instead of using
the smart contract). This choice is permanent--once set at creation, it
cannot be changed.
True is recommended for smaller syndicates where every member trusts
the manager, or for cases where a Syndicate is used as a cap table to
track ownership agreements without necessarily exchanging deposits.
False is recommended for large Syndicates where the members may desire
more transparency, or if a smart contract is being used in place of a
manager's wallet and trustless operation is desired.

*"H" refers to "ERR_SYN_ALREADY_EXISTS"
"I" refers to "ERR_MSG_SENDER_ALREADY_MANAGES_ONE_SYN"
"J" refers to "ERR_SYN_PROFIT_SHARE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_50_BASIS_POINTS"
"K" refers to "ERR_MNGR_PROFIT_SHARE_EXCEEDS_AVAILABLE_BASIS_POINTS"
"L" refers to "ERR_INVALID_DPST_ERC20_ADDRESS"
"M" refers to "ERR_MEMBR_MIN_DPST_CANT_EXCEED_MEMBR_MAX_DPST"
"N" refers to "ERR_MEMBR_MAX_DPST_CANT_EXCEED_TOTAL_MAX_DPST"
"O" refers to "ERR_CLOSE_DATE_MUST_BE_AFTER_BLOCK_TIMESTAMP"*

### `managerSetManagerPending(address syndicateAddress, address managerPendingAddress)` (public)
Used by the current manager to nominate a new manager
The new manager will be pending until they call
`managerPendingConfirm()`. This ensures that they have control over
their wallet and actively agree to manage the fund.
Changing a manager does not change the `syndicateAddress`. The
`syndicateAddress` is permanent but has no effect beyond acting as an
identifier.
To reset a `managerPending` request, just set the
`managerPending` to be `address(0)`. This is the default value for all
addresses.

**syndicateAddress**: The address of the Syndicate

**managerPendingAddress**: The address of the new manager

*"P" refers to "ERR_PENDING_MNGR_IS_ALREADY_CURRENT_MNGR"
"Q" refers to "ERR_PENDING_MNGR_ALREADY_MANAGES_ONE_SYN"
"R" refers to "ERR_PENDING_MNGR_CANT_BE_MNGR_FEE_ADDRESS"*

### `managerPendingConfirmAndSetManagerFeeAddress(address syndicateAddress, address managerFeeAddress)` (public)
This is a helper function that can be used by a pending manager
to simultaneously confirm management of a Syndicate and update the
manager fee address. This ensures that there is no gap in setting a new
fee address after taking ownership of a Syndicate.

**syndicateAddress**: The address of the Syndicate.

**managerFeeAddress**: The address where manager fees should be sent.

### `managerPendingConfirm(address syndicateAddress)` (public)
Used by the pending manager to claim current manager status
The pending manager is identified by `msg.sender`, which proves
that they have control over their address
Changing a manager does not change the syndicateAddress. The
syndicateAddress is permanent but has no effect beyond acting as an
identifier.

**syndicateAddress**: The address of the Syndicate

*"S" refers to "ERR_MSG_SENDER_IS_NOT_PENDING_MNGR"
"T" refers to "ERR_NEW_MNGR_ALREADY_MANAGES_ONE_SYN"
"U" refers to "ERR_NEW_MNGR_CANT_BE_MNGR_FEE_ADDRESS"
"V" refers to "ERR_MUST_WITHDRAW_ALL_DPSTS_BEFORE_BECOMING_MNGR"*

### `managerSetManagerFeeAddress(address syndicateAddress, address managerFeeAddress)` (public)
Used by a manager to set the address where fees should be sent

**syndicateAddress**: The address of the Syndicate

**managerFeeAddress**: The address where manager fees should be sent.
This cannot be the current or pending Syndicate manager

*"W" refers to "ERR_MNGR_FEE_ADDRESS_CANT_BE_0_OR_CURRENT_OR_PENDING_MNGR"*

### `managerSetManagerFees(address syndicateAddress, uint256 managerManagementFeeBasisPoints, uint256 managerPerformanceFeeBasisPoints)` (public)
Used by a manager to set their management and performance fees

**syndicateAddress**: The address of the Syndicate to set fees for

**managerManagementFeeBasisPoints**: The management fee of a Syndicate
manager, calculated per year (e.g. 2% per year, which would be passed in
as 200 basis points because the fees are adjusted by
BASIS_POINTS_DENOMINATOR, which is set to 10000)

**managerPerformanceFeeBasisPoints**: The performance fee of a
Syndicate manager, received when a member makes a withdrawal (e.g. 20%
percent per distribution upon withdrawal, which would be passed in as
2000 basis points)

*Manager fee INCREASES are only accepted while the Syndicate is
open; after the Syndicate is closed, fees can only be decreased. This
is to prevent managers from changing fees on members without giving
them recourse to act on those fee changes (i.e. the opportunity to
revoke their deposit).
In the future, we will include a timelock on all changes to raise
fees. Since the current architecture requires trust in a manager because
the manager holds the funds, this risk is one that we are willing to
accept in the short-term.
For the current version of this contract, the management fee must
be assessed manually by `managerAssessManagementFee()`. In
the future, the management fee will be automatically assessed yearly
(or another specified time interval) at the rate specified by
`managerManagementFeeBasisPoints` once we support asset management via
smart contracts.
"K" refers to "ERR_MNGR_PROFIT_SHARE_EXCEEDS_AVAILABLE_BASIS_POINTS"
"X" refers to "ERR_FEES_CAN_ONLY_BE_LOWERED_SYN_MUST_BE_OPEN_TO_RAISE_FEES"*

### `managerSetSyndicateProfitShare(address syndicateAddress, uint256 syndicateProfitShareBasisPoints)` (public)
Used by a manager to set the profit share that goes to Syndicate
The Syndicate profit share must be at least 0.50% (50 basis
points) and at most 100% (10000 basis points) - the manager's
performance fee.

**syndicateAddress**: The address of the Syndicate to set fees for

**syndicateProfitShareBasisPoints**: The profit share that is sent to
the Syndicate treasury. All fees are entered in basis points, or
fractional units of the BASIS_POINTS_DENOMINATOR (set to 10000). For
example, the minimum profit share of 0.50% should be passed in as 50
basis points (since it is 0.50% * 10000). This means that the max
precision is 0.01% (1 basis point).

*"J" refers to "ERR_SYN_PROFIT_SHARE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_50_BASIS_POINTS"
"Y" refers to "ERR_SYN_PROFIT_SHARE_EXCEEDS_AVAILABLE_BASIS_POINTS"*

### `managerAssessManagementFee(address syndicateAddress, address feeERC20Address, uint256 amount)` (public)
Used by a manager to assess a management fee. This can be used
to compensate a manager (in addition to the performance fee, which is
triggered automatically) or to pay expenses for a Syndicate.

**syndicateAddress**: The address of the Syndicate

**amount**: The management fee that should be deducted
from the Syndicate's holdings of the specified token. Note that this
management fee is a specific amount, not a percentage.

*This function is purely for transparency. A manager could also
assess a management fee by transferring assets directly from the
manager's wallet to the management fee address, but that can be seen as
less transparent because no event is emitted via the Syndicate contract.
This management fee currently does **not** leverage
`managerManagementFeeBasisPoints` in any way. For now, the manager
should calculate and assess the management fee manually based on their
agreement with members. In the future, once we have asset management
built into our contract, we can assess management fees automatically
every year (or other specified time interval).
Assessed management fees are not stored in the contract and should
instead be reconstructed from the events
"Z" refers to "ERR_ASSESSED_MANAGEMENT_FEE_MUST_BE_NONZERO"
"a" refers to "ERR_MNGR_FEE_ADDRESS_NOT_SET"*

### `managerSetNumMembersMax(address syndicateAddress, uint256 numMembersMax)` (public)
Set the maximum members that can contribute to the Syndicate

**syndicateAddress**: The address of the Syndicate

**numMembersMax**: The maximum number of members

### `managerSetNumMembersMaxToCurrent(address syndicateAddress)` (public)
This is a helper function that can be used by a manager to
freeze deposits from new members (allowing only supplemental deposits
from current members) while allowing replacements if existing members
drop out.

**syndicateAddress**: The address of the Syndicate

### `managerSetDepositMinMember(address syndicateAddress, uint256 depositMinMember)` (public)
Set the minimum deposit per wallet address. This is the minimum
that a single member can contribute to the Syndicate

**syndicateAddress**: The address of the Syndicate

**depositMinMember**: The minimum deposit amount per member. Must not
exceed the current `depositMaxMember`.

*"b" refers to "ERR_MIN_MEMBR_DPST_MUST_NOT_EXCEED_MAX_MEMBR_DPST"*

### `managerSetDepositMaxMember(address syndicateAddress, uint256 depositMaxMember)` (public)
Set the maximum deposit per wallet address. This is the maximum
that a single member can contribute to the Syndicate

**syndicateAddress**: The address of the Syndicate

**depositMaxMember**: The maximum deposit amount per user. Must be at
least the current `depositMinMember`, and cannot exceed the current
`depositMaxTotal`.

*"c" refers to "ERR_MAX_MEMBR_DPST_MUST_BE_AT_LEAST_MIN_MEMBR_DPST"
"d" refers to "ERR_MAX_MEMBR_DPST_CANT_EXCEED_MAX_TOTAL_DPST"*

### `managerSetDepositMaxTotal(address syndicateAddress, uint256 depositMaxTotal)` (public)
Set the maximum total deposit amount. This is the maximum
that all members combined can contribute to the Syndicate
`depositMaxTotal` is not required to be at least `depositTotal`.
Setting `depositMaxTotal` to be less than `depositTotal` can be thought
of as a simple way to cut off deposits if the Syndicate has grown too
large.

**syndicateAddress**: The address of the Syndicate

**depositMaxTotal**: The maximum total number of deposits. Must be
at least the current `depositMaxMember`.

*"e" refers to "ERR_MAX_TOTAL_DPST_MUST_BE_AT_LEAST_MAX_MEMBR_DPST"*

### `managerSetDepositForMembers(address syndicateAddress, address[] memberAddresses, uint256[] amounts)` (public)
Used by a manager to manually adjust the deposit amount for
multiple member address (e.g. in response to off-chain transactions).
This function **does not** enforce constraints on `depositMinMember`,
`depositMaxMember`, `depositMaxTotal`, or `numMembersMax`. However, it
**does** update bookkeeping of `depositTotal` and `numMembersCurrent`.
This function can only be called if the Syndicate is modifiable.
The modifiable boolean is set by the manager on creation and cannot be
changed after the Syndicate is created.
This function can only be called before distributions have been
enabled (though the Syndicate may be closed to deposits). If
distributions have already been enabled, then changing deposit amounts
could affect the ownership share of unclaimed distributions and create
significant problems for other members.

**syndicateAddress**: The address of the Syndicate

**memberAddresses**: The addresses of the member whose deposit is
being adjusted

**amounts**: The new deposit amount to be set for the corresponding
index in the memberAddresses array. These arrays must be the same
length. Note that the new amount completely replaces the prior deposit
amount for the member. It does not add or subtract from it.

*"4" refers to "MEMBER_ADDRESS_LENGTH_DOES_NOT_MATCH_AMOUNT_LENGTH"*

### `managerRejectDepositForMembers(address syndicateAddress, address[] memberAddresses)` (public)
Used by a manager to reject a member deposit

**syndicateAddress**: The Syndicate that the member deposited in

**memberAddresses**: The members whose WHOLE contribution is being
returned

*This function does not call `_processWithdrawal()` because
`_processWithdrawal()` transfers the amount to `msg.sender` (which in
this case is the manager, not the member).
This function returns error code "j" if a manager passes in a
member address that has no deposit.
The `onlyManager()` modifier must be listed first for it to be
marked as `virtual` by the Certora Prover harness script*

### `managerSetDateClose(address syndicateAddress, uint256 dateClose)` (public)
Used by a manager to change the close date of a Syndicate.
After `dateClose`, member deposits and withdrawals are
disabled, but the manager can still reject member deposits or override
member deposits (in the case of a modifiable Syndicate). However,
distributions cannot be claimed until the Syndicate is closed by a call
to `managerCloseSyndicate()` (or `managerSetDistribution()`, which
calls `managerCloseSyndicate()` if the Syndicate has not yet been
closed).
Until the manager closes the Syndicate to enable distributions,
`dateClose` can be pushed into the future, which will reallow member
deposits and withdrawals.

**syndicateAddress**: The address of the Syndicate

**dateClose**: The new close date, which must be in the future.

*"O" refers to "ERR_CLOSE_DATE_MUST_BE_AFTER_BLOCK_TIMESTAMP"*

### `managerCloseSyndicate(address syndicateAddress)` (public)
Used by a manager to close a Syndicate, finalizing all deposit
values.
 After `dateClose`, member deposits and withdrawals are
disabled, but the manager can still reject member deposits, override
member deposits (in the case of a modifiable Syndicate), or even
reenable deposits by changing `dateClose`. However, all deposit values
must be finalized by closing the Syndicate before any distributions can
be claimed. This is to prevent issues with redeeming distributions
interacting with new deposits (e.g. a user with a 10% stake performs a
withdrawal, and then a deposit occurs that dilutes them down to a 1%
stake. From that point onward, they would only be entitled to 1% of the
distributions).
If the contract is paused, members are unable to deposit or
withdraw from the Syndicate. Therefore, in order to prevent deposits
from being locked in if the Syndicate is closed, we do not allow
Syndicates to close while the contract is paused.

**syndicateAddress**: The address of the Syndicate

*Closing a Syndicate updates the dateClose to `block.timestamp`.
This can be used for calculating management fees or determining how
long the Syndicate has been in distribution.*

### `managerSetDistributions(address syndicateAddress, address[] distributionERC20Addresses, uint256[] amounts)` (public)
Used by a manager to initialize or increase the available
distributions for multiple ERC20 tokens.
If this function is called before distributions are enabled, it
will automatically enable distributions. This closes the Syndicate to
further deposits. Once enabled, distributions cannot be disabled.
Managers only receive performance fees when a user withdraws a
distribution, not when the manager sets the distribution. This prevents
managers from setting a high allowance, taking their fee, and then
cutting off the allowance and not allowing members to withdraw.

**syndicateAddress**: The address of the Syndicate

**distributionERC20Addresses**: The ERC20 contract addresses of the
distributions. Distributions can be set for any ERC20 token, including
the deposit token.

**amounts**: The amounts to be added to the available distributions
of each ERC20 token indexed in `distributionERC20Addresses`. This array
must have the same length as `distributionERC20Addresses`.

*"f" refers to "DISTRIBUTION_ERC20_LENGTH_DOES_NOT_MATCH_AMOUNT_LENGTH"*

### `managerSetDistributionClaimedForMembers(address syndicateAddress, address[] memberAddresses, address[] distributionERC20Addresses, uint256[] amounts)` (public)
Used by a manager to modify the claimed distribution amount for
a given member address
This function can only be called if the Syndicate is modifiable.
The modifiable boolean is set by the manager on creation and cannot be
changed after the Syndicate is created.
Claimed distributions can only be raised. If we allowed a
manager to lower a member's claimed distributions, the manager's token
allowance and token balance may not be enough to cover all future
distributions.
Claimed distributions cannot exceed the member's eligible
distributions as calculated from their deposit. If we allowed a manager
to raise a member's claimed distributions above their eligible
distributions, we would have to adjust `distributionTotal` accordingly
and this would result in every other member being eligible for an
additional distribution, which the manager may not have a sufficient
allowance/balance to cover.
This function can only be called after distributions are
enabled. Before distributions are enabled, there is no reason to call
this function since there are no distributions available to claim.

**syndicateAddress**: The address of the Syndicate

**memberAddresses**: The addresses of the members whose info is being
set.

**distributionERC20Addresses**: The ERC20 contract addresses of the
distribution.

**amounts**: The amounts to increase the claimed distribution of the
corresponding index in memberAddresses. All paramter arrays must match
exactly in length.

*"f" refers to "DISTRIBUTION_ERC20_LENGTH_DOES_NOT_MATCH_AMOUNT_LENGTH"
"4" refers to "MEMBER_ADDRESS_LENGTH_DOES_NOT_MATCH_AMOUNT_LENGTH"*

### `managerSetAllowlistEnabled(address syndicateAddress, bool allowlistEnabled)` (public)
Used by a manager to turn the allowlist on or off
This setter can only be called when the Syndicate is open, as
it only limits future deposits. To retroactively remove deposits that
have been made by members who may not have been on the allowlist, a
manager should use `managerRejectDepositForMembers()`.
**syndicateAddress**: The address of the Syndicate

**allowlistEnabled**: True if the Syndicate ONLY accepts deposits
from allowed addresses. False if any (accredited) member can make a
deposit.


### `managerAllowAddresses(address syndicateAddress, address[] memberAddresses)` (public)
Used by a manager to add an array of member addresses to the
allowlist and emit an event to allow for easy searching.
This function is only relevant when the manager has turned the
allowlist on (`SyndicateValues.allowlistEnabled == true`). If the
allowlist is off, anyone can make a deposit to the Syndicate without the
manager specifically allowing their address.

**syndicateAddress**: The address of the Syndicate to accept the
allowedAdresses

**memberAddresses**: An array of addresses to be allowed by the
Syndicate

*Allowing a single address costs 31527 in gas without an array and
32445 in gas with an array. This is a difference in cost of $0.17 at
current gas prices, which is a worthwhile trade off considering that (a)
allowing only one address will be less common than allowing multiple
addresses and (b) having two different allowAddress functions poses a
security risk if we forget to reconcile changes between them*

### `managerBlockAddresses(address syndicateAddress, address[] memberAddresses)` (public)
Used by a manager to remove a previously-allowed member address
from the allowlist
This function only proceeds when the allowlist is enabled, as
it is ineffective to maintain a blocklist of possible member addresses.
A manager who wishes to reverse a deposit into their fund should
instead use `managerRejectDepositForMembers()`.
Blocking a member address that has previously been allowed does
not reject or return their prior deposits. The deposit is still kept
in the syndicate.
**syndicateAddress**: The address of the Syndicate that contains the
allowlist

**memberAddresses**: The array of member addresses to remove.


### `managerSetMetadata(address syndicateAddress, string[] metadataKeys, string[] metadataValues)` (public)
Used by a manager to store values within the struct
The index of each key must be the same as the index of each
value

**metadataKeys**: The array of keys to store and access the metadata

**metadataValues**: The arrays of values for metadata to be set

*"5" refers to "METADATAKEYS_LENGTH_DOES_NOT_MATCH_VALUE_LENGTH"*

### `managerEmitMemo(address syndicateAddress, bytes32 blake2b328HashPartOne, bytes32 blake2b328HashPartTwo)` (public)
Emit an event that references a memo stored as 64 byte hash.
IPFS is recommended. If an IPFS hash is used, it must be
`blake2b-328` so that it can be stored in 64 bytes.
This can be used to store a fund thesis or describe a
transaction that a fund manager made in their wallet. This provides
transparency by notifying members of transactions and allowing them to
verify the proper use of funds.

**syndicateAddress**: The address of the Syndicate

**blake2b328HashPartOne**: The first 32 bytes of the hash

**blake2b328HashPartTwo**: The second 32 bytes of the hash

*For more on the recommendation to use `blake2b-328` hashes, see
https://medium.com/temporal-cloud/efficient-usable-and-cheap-storage-of-ipfs-hashes-in-solidity-smart-contracts-eb3bef129eba*

### `memberDeposit(address syndicateAddress, uint256 amount)` (public)
Used by a member to make a deposit to an open Syndicate.
If a manager is issuing a Syndicate under SEC Rule 506(b) of
Regulation D, a manager should only add a member's address(es) to the
allowlist if the member attests that they are an accredited investor.
This is also highlighted in the web interface, but it is not a
requirement of the smart contract since not all Syndicates are
securities, nor are all Syndicates that are securities necessarily
506(b) offerings (they could be 506(c) offerings for example).
Under Rule 506(b), up to 35 non-accredited investors can invest
in a private placement. These non-accredited investors must have
sufficient knowledge and experience, which is difficult to verify in a
decentralized context. As a result, we leave it up to the Syndicate
manager to track their own list of up to 35 non-accredited investors and
add them to the allowlist. The Syndicate manager must provide
disclosures to non-accredited investors that comply with Regulation A
offerings, give non-accredited investors financial statement
information specified in Rule 506, and be available to answer questions
from potential members who are non-accredited investors. This
responsibility rests with the Syndicate manager. See
https://www.sec.gov/smallbusiness/exemptofferings/rule506b
Nothing in this documentation should be considered legal
advice. If you are seeking any clarification, please email us at
hello[at]syndicateprotocol.org.

**syndicateAddress**: The Syndicate that a member is depositing to

**amount**: The amount of the deposit (note that this is calculated
using the Syndicate's primary ERC20 token)

*The member's deposit is associated to the address of `msg.sender`.
Functionality to transfer member balances to new owners will likely be
added in the future.
"j" refers to "ERR_DPST_MUST_BE_GREATER_THAN_ZERO"
"k" refers to "ERR_MEMBR_NOT_ALLOWED"
"l" refers to "ERR_MAX_TOTAL_DPST_REACHED_FOR_SYN"
"m" refers to "ERR_MAX_NUM_MEMBRS_REACHED"
"n" refers to "ERR_AMOUNT_LESS_THAN_MIN_MEMBR_DPST"
"o" refers to "ERR_MAX_MEMBR_DPST_REACHED"*

### `memberWithdraw(address syndicateAddress, address ERC20Address, uint256 amount)` (public)
Used by a member to withdraw a deposit from an open Syndicate
or a distribution from a closed Syndicate.
The member is identified via `msg.sender`. This call must be
made from the member address that originally called `memberDeposit` until
the functionality to transfer member balances is added.
Withdrawal options are different depending on the Syndicate's
progression through its life cycle. When the Syndicate is open, a member
can make a withdrawal in the deposit ERC20 token (essentially refunding
their deposit). After the Syndicate is closed, no withdrawals of any
kind can be made until the manager sets a distribution. After that
point, any allowed distribution token can be withdrawn.

**syndicateAddress**: The Syndicate that a member will withdraw from.

**ERC20Address**: Specifies the token type to be transferred
from the Syndicate to the member. For withdrawals from an open
Syndicate, this **must** match the Syndicate's `depositERC20Address`.

**amount**: The amount of tokens (of type specified by
`ERC20Address`) to be withdrawn

*Withdrawals are restricted to the primary or secondary ERC20
contract addresses. If we allowed any arbitrary ERC20 address, we would
also need to track ownership percentages across all arbitrary ERC20
addresses. This is significantly outside of the scope of the Syndicate
contract and should be saved for future asset management contracts.
Withdrawals are processed before any fees that any ERC-20 token may
assess. The amount that all users receive may be lower if an ERC-20
token takes a fee upon a transfer.
memberWithdraw() follows the Checks-Effects-Interactions pattern
"h" refers to "ERR_ERC20_NOT_SET_FOR_DISTRIBUTION"
"q" refers to "ERR_WITHDRAWAL_MUST_BE_GREATER_THAN_ZERO"
"r" refers to "ERR_OPEN_SYN_CAN_ONLY_WITHDRAW_DPST_ERC20"
"s" refers to "ERR_WITHDRAWAL_AMOUNT_EXCEEDS_BALANCE"
"t" refers to "ERR_FINAL_BALANCE_MUST_BE_0_OR_ABOVE_MIN"
"u" refers to "ERR_WITHDRAWAL_AMOUNT_GREATER_THAN_ELIGIBLE"
"v" refers to "ERR_SYN_CLOSED_BUT_DISTRIBUTIONS_NOT_ENABLED"*

### `_setDeposit(address syndicateAddress, address memberAddress, uint256 amount)` (internal)
Set the deposit amount for a single member.

**syndicateAddress**: The address of the Syndicate

**memberAddress**: The address of the member

**amount**: The new deposit amount to set for the member.

*This function makes setting a large number of deposit amounts
slightly more gas efficient by calling each of the parent function's.
modifiers only once. Importantly, that means the parent is responsible
for enforcing these contraints and CANNOT rely on this helper function
to do so.
"B" refers to ERR_MNGR_CANT_BE_MEMBR*

### `_setDistribution(address syndicateAddress, address distributionERC20Address, uint256 amount)` (internal)
Initalize or increase a distribution for a Syndicate
Syndicate and Manager fees are assessed when a distribution is
set by a manager, not when a distribution is claimed by a user. This
ensures that unclaimed distributions do not prevent Syndicate and
managers from receiving their portion of the fees, and in general makes
receiving fees much more predictable.
This function does not verify that the manager has set an
appropriate allowance for the desired balance. It is the responsibility
of the manager to do so, since any allowance checks that could occur in
this function would be vulnerable to front-running.

**syndicateAddress**: The address of the Syndicate

**distributionERC20Address**: The ERC20 contract address of the
distribution

**amount**: The amount by which the available distribution should be
increased.

*Note that distribution amount available to users is after Syndicate
and manager fees are assessed. For example, if a manager sets a
distribution of 1000 DAI and the profit share to Syndicate is 0.50% (50
basis points) and the manager's performance fee is 2.00% (200 basis
points), the amount available for distribution to users would be 97.5%
of 1000 -- i.e. 975 USDC.
This function makes setting large number of distributions slightly
more gas efficient by creating an internal setDistribution function that
skips the modifier check.
"z" refers to "ERR_NO_NEW_BALANCE_AVAILABLE"
"1" refers to "ERR_DISTRIBUTION_EXCEEDS_ALLOWANCE"*

### `_setDistributionClaimedForMember(address syndicateAddress, address memberAddress, address distributionERC20Address, uint256 amount)` (internal)
Used by a manager to modify the claimed distribution amount for
a given member address
This function makes setting large number of distributions
slightly more gas efficient by calling the parent functions's modifiers
only once. Importantly, that means the parent is responsible for
enforcing these contraints and CANNOT rely on this helper function to
do so.
A manager must set a distribution before they can set claimed
distributions for particular members. If a manager is using Syndicate
purely to represent a cap table, they can set a distribution amount of 0
for their desired ERC-20 address.

**syndicateAddress**: The address of the Syndicate

**memberAddress**: The address of the member whose info is being
queried

**distributionERC20Address**: The ERC20 contract address of the
distribution

**amount**: The amount to increase a member's claimed distributions.

*"h" refers to "ERR_ERC20_NOT_SET_FOR_DISTRIBUTION"
"i" refers to "ERR_NEW_CLAIMED_DISTRIBUTION_GREATER_THAN_ELIGIBLE"*

### `_processDeposit(address syndicateAddress, uint256 amount)` (internal)
Process a deposit to a Syndicate.

**syndicateAddress**: The address of the Syndicate

**amount**: The amount that the `msg.sender` is depositing, in the
token defined by the Syndicate's depositERC20Address

*All methods that call this internal function should implement the
onlyBeforeDateClose modifier AND perform all appropriate checks (e.g.
staying under the member's max deposit and Syndicate max total deposit)
on the passed-in parameters.
This function is high risk. If the `.transferFrom` line can be
redirected elsewhere, deposits could be stolen. In addition, if the
deposits are not properly tracked, a user could withdraw more than their
allocated share of the distributions.
We check the difference between balances to determine the after-fee
amount of a deposit.
"y" refers to "ERR_NEW_BAL_MUST_BE_GREATER_THAN_OLD_BAL"*

### `_processWithdrawalOpen(address syndicateAddress, uint256 amount)` (internal)
Withdraws deposits from an open fund in primary tokens.

**syndicateAddress**: The address of the Syndicate

**amount**: Amount in primary distribution tokens to be withdrawn

*This function is high risk. If the `.transferFrom` line can be
redirected elsewhere, withdrawals could be stolen. In addition, if the
withdrawals are not properly tracked, a user could withdraw more than
their allocated share of the distributions.*

### `_processWithdrawalClosed(address syndicateAddress, address distributionERC20Address, uint256 amount)` (internal)
Withdraws distributions from a closed fund in primary or
secondary tokens.

**syndicateAddress**: The address of the Syndicate

**distributionERC20Address**: The contract address of the tokens
awaiting distribution. This parameter implicitly specifies the type of
distribution (i.e. in primary or secondary tokens) being withdrawn.

**amount**: Amount to be withdrawn in ERC20 tokens specified.

*This function is high risk. If the `.transferFrom` line can be
redirected elsewhere, withdrawals could be stolen. In addition, if the
withdrawals are not properly tracked, a user could withdraw more than
their allocated share of the distributions.*

### `_checkBookkeeping(uint256 oldTotal, uint256 amount, uint256 newTotal, bool add)` (internal)
Confirm that amounts for a specific member are in sync with
their corresponding total values. Any revert from this function will
result in ALL effects of the transaction being reverted.

**oldTotal**: The old total value

**amount**: The amount that the total is changed by

**newTotal**: The new total value

**add**: True will add. Calculate oldTotal + amount = newTotal
False will subtract. Calculate oldTotal - amount = newTotal

*See SYN-141 for more details on this bookkeeping function
Subtraction also checks to confirm that the value has not gone
negative, since our contract should not have negative values anywhere
We do not use `pure` here because Solidity can run into issues by
not reverting on view/pure functions.
See https://github.com/ethereum/solidity/issues/4840
"w" refers to "ERR_BOOKKEEPING_ADDITION_OUT_OF_SYNC"
"x" refers to "ERR_BOOKKEEPING_SUBTRACTION_OUT_OF_SYNC"*

### `calculateEligibleWithdrawal(uint256 depositMember, uint256 totalContributions, uint256 distributionClaimedMember, uint256 distributionTotal) → uint256` (public)
Calculates the maximum value in distribution tokens (in either
primary or secondary ERC20) that a member can withdraw based on their
percentage ownership at the moment that the fund closed and the
distributions that they have already received.

**depositMember**: Total user has deposited to the fund

**totalContributions**: Total contributions (from anyone) to the fund

**distributionClaimedMember**: Value in distributions that user has
withdrawn from the fund already.  Make sure this matches the token type
(primary or secondary) passed in for distributionTotal.

**distributionTotal**: Total distributions available from the fund,
claimed or not.  Make sure this matches the token type (primary or
secondary) passed in for distributionClaimedMember.

_**Value**_: in distributions that user is eligible to withdraw

*HIGH RISK: If this calculation is incorrect, a user could withdraw
more or less than they are entitled to.
"2" refers to "ERR_NO_ELIGIBLE_WITHDRAWAL"*

### `calculateProfitShare(uint256 amount, uint256 syndicateProfitShareBasisPoints, uint256 managerProfitShareBasisPoints) → uint256, uint256, uint256` (public)
Calculates the fees to be deducted upon the withdrawal of a
distribution from a closed Syndicate.

**amount**: Total amount to be withdrawn, including fees.

**syndicateProfitShareBasisPoints**: Profit share to Syndicate in
basis points (i.e. as a fraction divided by 10000)

**managerProfitShareBasisPoints**: Profit share to the Syndicate
manager in basis points (i.e. as a fraction divided by 10000)

_**Tuple**_: of the amounts (toUser, toSyndicate, toManager) that will
be transferred, together adding up to the passed amount.

*"3" refers to "ERR_WITHDRAWAL_FEES_MISCALCULATED"*

### `getSyndicateValues(address syndicateAddress) → struct Syndicate.SyndicateValues` (public)
Get the values for a Syndicate

**syndicateAddress**: The address of the Syndicate

_**SyndicateValues**_: struct

*This function **must** be kept up to date with the web3 UI when
making changes. All PRs that change this function or the
SyndicateValues struct **must** be coordinated with an engineer on the
Web3 Dashboard.*

### `getMemberInfo(address syndicateAddress, address memberAddress) → uint256, uint256, bool` (public)
Get the member info for a Syndicate
To get the claimed distributions for another ERC20, use
`getDistributionClaimedMember()`

**syndicateAddress**: The address of the Syndicate

**memberAddress**: The address of the member whose info is being
queried

_**Tuple**_: of: (1) member's deposits into a Syndicate, (2) member's
claimed distributions (withdrawals) from the *primary* ERC20, (3)
whether member is on the allowlist for the Syndicate

*This function **must** be kept up to date with the Web3 UI when
making changes. All PRs that change this function **must** be
coordinated with an engineer on the Web3 Dashboard.*

### `getDistributionTotal(address syndicateAddress, address distributionERC20Address) → uint256` (public)
Get a Syndicate's total distributions for a given ERC20

**syndicateAddress**: The address of the Syndicate

**distributionERC20Address**: The ERC20 address of the token whose
distributions are being queried

_**The**_: `distributionTotal` for a given `distributionERC20Address`

### `getDistributionClaimedMember(address syndicateAddress, address memberAddress, address distributionERC20Address) → uint256` (public)
Get a member's claimed distributions for a given ERC20

**syndicateAddress**: The address of the Syndicate

**memberAddress**: The address of the member whose info is being
queried

**distributionERC20Address**: The ERC20 address of the token whose
distributions are being queried

_**The**_: distribution claimed by a member for a given
`distributionERC20Address`

### `getDistributionUnclaimedMember(address syndicateAddress, address memberAddress, address distributionERC20Address) → uint256` (public)
Get a member's unclaimed distribution for a given ERC20

**syndicateAddress**: The address of the Syndicate

**memberAddress**: The address of the member whose info is being
queried

**distributionERC20Address**: The ERC20 address of the token whose
distributions are being queried

_**The**_: unclaimed distribution for a member for a given
`distributionERC20Address`

### `getDistributionClaimedTotal(address syndicateAddress, address distributionERC20Address) → uint256` (public)
Get a Syndicate's total claimed distributions for a given ERC20

**syndicateAddress**: The address of the Syndicate

**distributionERC20Address**: The ERC20 address of the token whose
distributions are being queried

_**The**_: `distributionTotal` for a given `distributionERC20Address`

### `getMetadata(address syndicateAddress, string metadataKey) → string` (public)
Get the metadata for a given key within a Syndicate

**syndicateAddress**: The address of the Syndicate

**metadataKey**: The string that is the key of the metadata to look up

_**metadataValue**_: as a string

### `ownerPauseContract()` (public)
Emergency pause function that can only be triggered by the
contract owner
Its purpose is to pause deposits and withdrawals. All other
functions will work when paused

### `ownerUnpauseContract()` (public)
Emergency unpause function that can only be triggered by the
contract owner
Its purpose is to unpause deposits and withdrawals. All other
functions will work when paused

### `ownerTransferOwnership(address newOwner)` (public)
Transfers ownership to the provided address.

**newOwner**: The new owner's address.

### `ownerRenounceOwnership()` (public)
Renounce ownership of the contract
If necessary, unpauses the contract before ownership is
renounced to ensure that deposits/withdrawals are not locked

### `ownerSetContractFeeAddress(address feeAddress)` (public)
set a new fee address for the contract function that can only
be triggered by the contract owner.

**feeAddress**: The owner's new contract fee address


### `ownerSetterContractFeeAddress(address contractFeeAddress, uint256 timestamp)`

Emit an event when the owner of the contract sets a new
contract fee address



### `managerCreatedSyndicate(address syndicateAddress, uint256 managerManagementFeeBasisPoints, uint256 managerPerformanceFeeBasisPoints, uint256 syndicateProfitShareBasisPoints, uint256 numMembersMax, address depositERC20Address, uint256 depositMinMember, uint256 depositMaxMember, uint256 depositMaxTotal, uint256 dateCreation, uint256 dateClose, bool allowlistEnabled, bool modifiable)`

Emit an event when a manager creates a Syndicate


This event can be used to list all Syndicates on the platform

### `managerSetterManagerPending(address syndicateAddress, address managerPendingAddress)`

Emit an event when a manager sets a new pending manager



### `managerPendingConfirmed(address syndicateAddress, address oldManager, address newManager)`

Emit an event when a pending manager confirms management of a
Syndicate



### `managerSetterManagerFeeAddress(address syndicateAddress, address managerFeeAddress)`

Emit an event when a manager sets a new fee address



### `managerSetterManagerFees(address syndicateAddress, uint256 managerManagementFeeBasisPoints, uint256 managerPerformanceFeeBasisPoints)`

Emit an event when a manager sets new manager fees



### `managerAssessedManagementFee(address syndicateAddress, uint256 managementFeeAmount, uint256 timestamp)`

Emit an event when a manager assesses a management fee



### `managerSetterSyndicateProfitShare(address syndicateAddress, uint256 syndicateProfitShareBasisPoints)`

Emit an event when a manager sets a new Syndicate profit share



### `managerSetterNumMembersMax(address syndicateAddress, uint256 numMembersMax, uint256 numMembersCurrent)`

Emit an event when a manager sets a new maximum number of
allowed members



### `managerSetterDepositMinMember(address syndicateAddress, uint256 depositMinMember)`

Emit an event when a manager sets a new minimum deposit amount
per wallet address



### `managerSetterDepositMaxMember(address syndicateAddress, uint256 depositMaxMember)`

Emit an event when a manager sets a new maximum deposit amount
per wallet address



### `managerSetterDepositMaxTotal(address syndicateAddress, uint256 depositMaxTotal)`

Emit an event when a manager sets a new maximum total deposit
amount



### `managerSetterDepositForMember(address syndicateAddress, address memberAddress, uint256 depositMember, uint256 timestamp)`

Emit an event when a manager overrides a member's balance
with a new value. Applicable to `modifiable` Syndicates only.


The balance emitted is the new value, not the change in value

### `memberDeposited(address syndicateAddress, address memberAddress, uint256 amountDeposited, uint256 timestamp)`

Emit an event when a member deposits to a Syndicate


This is the only way to search for a member's Syndicates. The
Syndicates on chain rely on a mapping, so they are not iterable.
Instead, it's necessary to search through an indexed memberAddress
off-chain to get a list of a member's Syndicates for screens such as the
My Syndicates screen.
This must be reconciled with `memberWithdrewDeposit` events to get
a list of all Syndicates for which a member has a nonzero deposit.

### `memberWithdrewDeposit(address syndicateAddress, address memberAddress, address depositERC20Address, uint256 amountWithdrawn, uint256 timestamp)`

Emit an event when a member withdraws a deposit from a
Syndicate. If a member withdraws the full amount that they originally
deposited, then they no longer have any holdings in that Syndicate.


A different event is emitted for withdrawing distributions

### `managerSetterDateClose(address syndicateAddress, uint256 dateclose)`

Emit an event when a manager changes the close date



### `managerClosedSyndicate(address syndicateAddress, uint256 timestamp)`

Emit an event when a manager closes a Syndicate



### `managerSetterDistribution(address syndicateAddress, address distributionERC20Address, uint256 amountToMembers, uint256 amountToSyndicate, uint256 amountToManager)`

Emit an event when a manager sets a distribution



### `managerSetterDistributionERC20Address(address syndicateAddress, address distributionERC20Address)`

Emit an event when a manager sets a distribution for a new
ERC20 address. This is called by `managerSetDistributions()` the first
time a distribution is set for a particular ERC20 address.



### `managerSetterDistributionClaimedForMember(address syndicateAddress, address memberAddress, address distributionERC20Address, uint256 distributionClaimedMember, uint256 timestamp)`

Emit an event when a manager overrides a member's claimed
distributions. Applicable to `modifiable` Syndicates only.


The balance emitted is the new value, not the change in
value--reconcile with `memberWithdrewDistribution` events accordingly

### `memberWithdrewDistribution(address syndicateAddress, address memberAddress, address distributionERC20Address, uint256 amountWithdrawn, uint256 timestamp)`

Emit an event when a member withdraws a distribution


A different event is emitted for withdrawing deposits

### `managerAllowedAddresses(address syndicateAddress, address memberAddress)`

Emit an event when a manager adds a member's wallet address to
the allowlist


These events can be used to notify a member off-chain that their
address is now allowed
The timestamp is not critical here and in the below events, so it
is not included to save on gas costs. When a timestamp is necessary, it
can be pulled by evaluating the block that an event was contained in
(since the timestamp is just the block.timestamp)

### `managerBlockedAddress(address syndicateAddress, address memberAddress)`

Emit an event when a manager removes a member's wallet address
from the allowlist


These events can be used to notify a member off-chain that their
address is now blocked (e.g. removed from the allowlist)

### `managerSetterMetadata(address syndicateAddress, string metadataKey, string metadataValue)`

Emit an event when a manager sets metadata for a Syndicate



### `managerEmittedMemo(address syndicateAddress, address managerCurrent, bytes32 blake2b328HashPartOne, bytes32 blake2b328HashPartTwo, uint256 timestamp)`

Emit an event when a manager associates a memo with a Syndicate


Memos emitted via this event are not stored in the Syndicate.
Values that need to be stored should instead be passed to
`managerSetMetadata()`, which also emits the metadata as an event.

