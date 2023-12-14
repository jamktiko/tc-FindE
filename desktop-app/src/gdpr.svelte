<script>
  export let checked;

  let showModal = false;

  function toggleModal() {
    showModal = !showModal;
  }

  function closeModal(event) {
    if (event.target === event.currentTarget) {
      showModal = false;
    }
  }
</script>

<div>
  <label>
    <input type="checkbox" bind:checked />
    I have read and accepted our
    <a href="#" on:click={toggleModal}>privacy policy and terms of use</a>.
  </label>

  {#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="overlay" on:click={closeModal}>
      <div class="modal">
        <div class="content">
          <div class="logo">
            <img src="logoFINDE-black.png" alt="logo" />
          </div>
          <h2>Privacy Policy (FindE):</h2>
          <p>
            <strong>1. Purpose of the Privacy Policy:</strong> This privacy policy
            defines how the FindE application collects, processes, and protects user’s
            personal information and rights related to privacy. Our goal is to provide
            our users with a safe and personalized experience when using our application.
          </p>
          <h3>2. Collected Information:</h3>
          <p>
            <strong>a. Registration Information:</strong> When you register for the
            application, we collect your name, email address, and username.
          </p>
          <p>
            <strong>b. Location Information:</strong> FindE uses location services
            to provide you with location-based content and events.
          </p>
          <p>
            <strong>c. Usage and Device Information:</strong> We gather information
            on how you use the FindE application and the devices you use. This data
            helps us improve the functionality of the application and provide tailored
            recommendations.
          </p>
          <h3>3. Purpose of Data Use:</h3>
          <p>The collected information is used for the following purposes:</p>
          <p>
            <strong>a. Facilitating event recommendations and display.</strong>
          </p>
          <p>
            <strong
              >b. Improving application functionality and personalizing user
              experience.</strong
            >
          </p>
          <p><strong>c. Providing information to event organizers.</strong></p>
          <h3>4. Use of Location:</h3>
          <p>
            <strong>a. Location Services:</strong> The application uses location
            services to recommend events in your vicinity.
          </p>
          <p>
            <strong>b. Permission:</strong> Users are explicitly asked for permission
            to use location data in the application. Your safety is of utmost importance
            to us, and your location data is used solely for customizing events for
            you.
          </p>
          <h3>5. Event Photos:</h3>
          <p>
            <strong>a. User-Uploaded Photos:</strong> Event creators can add photos
            to events, visible to other users in the event description. We emphasize
            your privacy and recommend adding only appropriate photos to your events.
          </p>
          <h3>6. Data Protection:</h3>
          <p>
            We keep your information secure and protect it from misuse or
            unauthorized access. FindE employs industry standards to safeguard
            data.
          </p>
          <h3>7. Data Sharing:</h3>
          <p>
            We do not sell, rent, or share your personal information with third
            parties without your consent, except for purposes mandated by law.
            User privacy is crucial to us, and your data is treated
            confidentially.
          </p>
          <h3>8. User Rights:</h3>
          <p>
            You have the right to review, edit, and delete your personal
            information. You can also withdraw your consent for data processing.
            Users have full control over their data and can make changes through
            the application settings.
          </p>
          <h3>9. Changes to the Privacy Policy:</h3>
          <p>
            We reserve the right to update this privacy policy, with
            notifications within the application. Users will be informed in
            advance of any changes to keep them informed about our privacy
            policy.
          </p>
          <div>Terms of Use:</div>
          <p>
            <strong>1. Service Usage:</strong> By using the FindE application, you
            agree to abide by these terms of use and applicable laws. Usage of the
            application requires the user's consent to these terms.
          </p>
          <p>
            <strong>2. Registration:</strong> To access certain features of the FindE
            application, you must register and create an account. Registration is
            a necessary part of using the application and enables a personalized
            user experience.
          </p>
          <p>
            <strong>3. Usage Restrictions:</strong> Users must not use the FindE
            application for unlawful purposes, share inappropriate content, or violate
            the rights of other users. Users must adhere to accepted terms of use
            to ensure the secure use of the application.
          </p>
          <p>
            <strong>4. Fees for Application Usage:</strong> Certain features of the
            FindE application may require a paid subscription, and users agree to
            pay agreed-upon fees. These fees are associated with premium features
            that add value to users.
          </p>
          <p>
            <strong>5. Rights to Changes:</strong> We reserve the right to modify
            FindE application features, pricing, and terms of use. Our aim is to
            enhance the user experience, with advance notice of any changes.
          </p>
          <p>
            <strong>6. Termination:</strong> We reserve the right to terminate your
            account or restrict access to the FindE application due to violations
            or neglect. Users are responsible for complying with the terms of use,
            and violations may lead to account closure.
          </p>
          <p>
            <strong>7. Limitation of Liability:</strong> We are not responsible for
            content produced by third parties or damages resulting from the use of
            the FindE application. We emphasize users' responsibility in evaluating
            content and events.
          </p>

          <button on:click={toggleModal}>Close</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    z-index: 1000;
    max-width: 80%;
    max-height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo {
    width: 40%;
    height: auto;
    margin-bottom: 20px;
    margin-right: auto;
    margin-left: auto;
  }

  .content {
    max-width: 600px;
    width: 100%;
    text-align: justify;
  }

  h2 {
    color: #333;
    font-size: 1.5em;
    margin-bottom: 10px;
  }

  h3 {
    color: #555;
    font-size: 1.2em;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    margin-bottom: 16px;
  }

  a {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
  }

  a:hover {
    color: #4a99ee;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
  }

  button {
    color: white;
    background-color: black;
    border-radius: 20px;
    padding: 6px 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 50%;
    cursor: pointer;
    margin-top: 2em;
    margin-right: auto;
    margin-left: auto;
    transition: background-color 0.7s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button:hover {
    color: black;
    background-color: rgb(138, 138, 138);
    border-radius: 20px;
    padding: 6px 10px;
    font-size: 1rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
    width: 50%;
    cursor: pointer;
    transition: background-color 0.7s ease-in-out;
    margin-top: 2em;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
