@php
    // dd($dsTheLoai);
@endphp
<header class="header trans_300">

    <!-- Top Navigation -->

    <div class="top_nav">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="top_nav_left">free shipping on all u.s orders over $50</div>
                </div>
                <div class="col-md-6 text-right">
                    <div class="top_nav_right">
                        <ul class="top_nav_menu">

                            <!-- Currency / Language / My Account -->

                            <li class="currency">
                                <a href="#">
                                    usd
                                    <i class="fa fa-angle-down"></i>
                                </a>
                                <ul class="currency_selection">
                                    <li><a href="#">cad</a></li>
                                    <li><a href="#">aud</a></li>
                                    <li><a href="#">eur</a></li>
                                    <li><a href="#">gbp</a></li>
                                </ul>
                            </li>
                            <li class="language">
                                <a href="#">
                                    English
                                    <i class="fa fa-angle-down"></i>
                                </a>
                                <ul class="language_selection">
                                    <li><a href="#">French</a></li>
                                    <li><a href="#">Italian</a></li>
                                    <li><a href="#">German</a></li>
                                    <li><a href="#">Spanish</a></li>
                                </ul>
                            </li>
                            <li class="account">
                                <a href="#">
                                    My Account
                                    <i class="fa fa-angle-down"></i>
                                </a>
                                <ul class="account_selection">
                                    <li><a href="#"><i class="fa fa-sign-in" aria-hidden="true"></i>Sign
                                            In</a></li>
                                    <li><a href="#"><i class="fa fa-user-plus" aria-hidden="true"></i>Register</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Navigation -->

    <div class="main_nav_container">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-right">
                    <div class="logo_container">
                        <a href="{{ route('frontend.index.index') }}">Nhi<span>Fashion</span></a>
                    </div>
                    <nav class="navbar">
                        <ul class="navbar_menu">
                            <li><a href="{{ route('frontend.index.index') }}">Trang chủ</a></li>
                            @foreach ($dsTheLoai as $theLoaiCha)
                                @if ($theLoaiCha->the_loai_cha_id == null)
                                    <li>
                                        <a
                                            href="{{ route('frontend.the_loai.index', $theLoaiCha->slug) }}">{{ $theLoaiCha->ten }}</a>
                                        @if (count($theLoaiCha->theLoaiCon) > 0)
                                            <div class="submenu">
                                                @foreach ($theLoaiCha->theLoaiCon as $theLoai)
                                                    <a
                                                        href="{{ route('frontend.the_loai.index', $theLoai->slug) }}">{{ $theLoai->ten }}</a>
                                                @endforeach
                                            </div>
                                        @endif
                                    </li>
                                @endif
                            @endforeach
                            <li><a href="contact.html">Liên hệ</a></li>
                        </ul>
                        <ul class="navbar_user">
                            <li><a href="#"><i class="fa fa-search" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i class="fa fa-user" aria-hidden="true"></i></a></li>
                            <li class="checkout" id="gio_hang">
                                <a href="">
                                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                                    <span id="checkout_items" class="checkout_items">{{ $numCart }}</span>
                                </a>
                            </li>
                        </ul>
                        <div class="hamburger_container">
                            <i class="fa fa-bars" aria-hidden="true"></i>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </div>

</header>
